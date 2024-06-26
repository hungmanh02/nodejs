import _, { includes, reject } from "lodash";
import db from "../models/index";
import { raw } from "body-parser";
require('dotenv').config();
const MAX_NUMBER_SCHEDULE=process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHomeService = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getAllDoctorService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: {
          roleId: "R2",
        },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let saveDetailInforDoctorService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHtml ||
        !inputData.contentMarkdown ||
        !inputData.action ||
        !inputData.selectedPrice ||
        !inputData.selectedPayment ||
        !inputData.selectedProvince ||
        !inputData.nameClinic ||
        !inputData.addressClinic ||
        !inputData.note
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        // upsert to Markdown table
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHtml: inputData.contentHtml,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHtml = inputData.contentHtml;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            doctorMarkdown.updateAt = new Date();
            await doctorMarkdown.save();
          }
        }
        // upsert to Doctor_infor table
        let doctorInfor = await db.Doctor_Infor.findOne({
          where : {
            doctorId:inputData.doctorId
          },
          raw:false
        })
        if(doctorInfor){
          //update
          doctorInfor.doctorId= inputData.selectedDoctor;
            doctorInfor.priceId = inputData.selectedPrice;
            doctorInfor.paymentId = inputData.selectedPayment;
            doctorInfor.provinceId = inputData.selectedProvince;
            doctorInfor.nameClinic= inputData.nameClinic;
            doctorInfor.addressClinic= inputData.addressClinic;
            doctorInfor.note= inputData.note;
            await doctorInfor.save();
        }else{
          // create
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId:inputData.selectedPrice,
            paymentId:inputData.selectedPayment,
            provinceId:inputData.selectedProvince,
            nameClinic:inputData.nameClinic,
            addressClinic:inputData.addressClinic,
            note:inputData.note
          })
        }

        resolve({
          errCode: 0,
          errMessage: "Save infor doctor succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailDoctorByIdService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter !",
        });
      } else {
        let dataDetailDoctor = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHtml", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
             {
              model: db.Doctor_Infor,
              attributes:  {
                exclude: ["id","doctorId"],
              },
              include:[
                {
                  model: db.Allcode,
                  as: "priceIdData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentIdData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceIdData",
                  attributes: ["valueEn", "valueVi"],
                },
              ]
            }
          ],
          raw: false,
          nest: true,
        });
        if (dataDetailDoctor && dataDetailDoctor.image) {
          dataDetailDoctor.image = new Buffer(
            dataDetailDoctor.image,
            "base64"
          ).toString("binary");
        }
        if (!dataDetailDoctor) data = {};
        resolve({
          errCode: 0,
          data: dataDetailDoctor,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let bulkCreateScheduleService=(data)=>{
  return new Promise( async(resolve,reject)=>{
    try {
      if(!data.arrSchedule || !data.doctorId || !data.formatedDate){
        resolve({
          errCode:1,
          errMessage:"Missing required parameter !"
        })
      }else{
        let schedule=data.arrSchedule;
        if(schedule && schedule.length>0){
          schedule=schedule.map(item=>{
            item.maxNumber=MAX_NUMBER_SCHEDULE;
            return item;
          })
        }
        
        let existing= await db.Schedule.findAll({
          where:{doctorId:data.doctorId, date:data.formatedDate},
          attributes:['timeType','date','doctorId','maxNumber'],
          raw:true
        })
        // compare difference
        let toCreate= _.differenceWith(schedule,existing,(a,b)=>{
          return a.timeType===b.timeType && +a.date===+b.date;
        });
     

        // create data
        if(toCreate && toCreate.length >0){
           await db.Schedule.bulkCreate(toCreate);
        }
        resolve({
          errCode:0,
          errMessage:"Ok"
        })
      }
    } catch (e) {
      reject(e)
    }
  });

};
let getScheduleDoctorByDateService=(doctorId,date)=>{
  return new Promise(async(resolve,reject)=>{
      try {
         if(!doctorId || !date){
          resolve({
            errCode:1,
            errMessage:"Missing required parameter !"
          });
         }else{
           let dataSchedule= await db.Schedule.findAll({
            where:{doctorId:doctorId,date:date},
            include: [
              {
                model: db.Allcode,
                as: "timeTypeData",
                attributes: ["valueEn", "valueVi"],
              }
            ],
            raw: false,
            nest: true,
           })
           if(!dataSchedule) dataSchedule=[];
            resolve({
              errCode:0,
              errMessage:'Ok',
              data:dataSchedule
            })
         }
      } catch (e) {
        reject(e)
      }
  })

}
let getExtraInforDoctorByIdService=(idInput)=>{
  return new Promise( async (resolve, reject)=>{
    try {
      if(!idInput){
        resolve({
          errCode:1,
          errMessage:'Missing required parameters !'
        })
      }else{
        let data= await db.Doctor_Infor.findOne({
          where:{ doctorId:idInput},
          attributes:{ exclude:['id','doctorId']},
          include:[
            { model:db.Allcode,
              as:'priceIdData',
              attributes:['valueEn','valueVi']
            },
            {
              model:db.Allcode,
              as:'paymentIdData',
              attributes:['valueEn','valueVi']
            },
            {
              model:db.Allcode, 
              as:'provinceIdData',
              attributes:['valueEn','valueVi']
            },
          ],
          raw:false,
          nest:true
        });
        if(!data) data={}
         resolve({
          errCode:0,
          data:data
         })
      }
      
    }  catch (e) {
      reject(e)
    }
  })

}

let getProfileInforDoctorByIdService=(inputId)=>{
  return new Promise( async (resolve, reject)=>{
    try {
      if(!inputId){
        resolve({
          errCode:1,
          errMessage:"Missing required parameters !"
        })
      }else{
         let dataProfileDoctor = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
             {
              model: db.Markdown,
              attributes: ["description", "contentHtml", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
             {
              model: db.Doctor_Infor,
              attributes:  {
                exclude: ["id","doctorId"],
              },
              include:[
                {
                  model: db.Allcode,
                  as: "priceIdData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentIdData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceIdData",
                  attributes: ["valueEn", "valueVi"],
                },
              ]
            }
          ],
          raw: false,
          nest: true,
        });
        if (dataProfileDoctor && dataProfileDoctor.image) {
          dataProfileDoctor.image = new Buffer(
            dataProfileDoctor.image,
            "base64"
          ).toString("binary");
        }
        if (!dataProfileDoctor) data = {};
        resolve({
          errCode: 0,
          data: dataProfileDoctor,
        });
      }
      
    }  catch (e) {
      reject(e)
    }
  })

}
module.exports = {
  getTopDoctorHomeService: getTopDoctorHomeService,
  getAllDoctorService: getAllDoctorService,
  saveDetailInforDoctorService: saveDetailInforDoctorService,
  getDetailDoctorByIdService: getDetailDoctorByIdService,
  bulkCreateScheduleService:bulkCreateScheduleService,
  getScheduleDoctorByDateService:getScheduleDoctorByDateService,
  getExtraInforDoctorByIdService:getExtraInforDoctorByIdService,
  getProfileInforDoctorByIdService:getProfileInforDoctorByIdService
};
