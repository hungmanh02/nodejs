import doctorService from "../services/doctorService";
let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10; // neu khong truyen limit thi lay toi da 10 bang ghi
  try {
    let doctors = await doctorService.getTopDoctorHomeService(+limit);
    return res.status(200).json(doctors);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ...",
    });
  }
};
let getAllDoctor = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctorService();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let postInforDoctor = async (req, res) => {
  try {
    let detailInforDoctor = await doctorService.saveDetailInforDoctorService(
      req.body
    );
    return res.status(200).json(detailInforDoctor);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getDetailDoctorById = async (req, res) => {
  try {
    if (!req.query.id) {
      // console.log(req.query.id);
      return res.status(200).json({
        errCode: 2,
        errMessage: "Missing required query id",
      });
    } else {
      let infor = await doctorService.getDetailDoctorByIdService(req.query.id);
      return res.status(200).json(infor);
    }
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let bulkCreateSchedule= async(req,res)=>{

  try {
      
      let bulkSchedule = await doctorService.bulkCreateScheduleService(req.body);
      return res.status(200).json(bulkSchedule);
    
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }

}
let getScheduleDoctorByDate=async (req,res)=>{
  try {
      
    let getSchedule = await doctorService.getScheduleDoctorByDateService(req.query.id,req.query.date);
    return res.status(200).json(getSchedule);
  
} catch (e) {
  return res.status(200).json({
    errCode: -1,
    errMessage: "Error from the server",
  });
}
}
let getExtraInforDoctorById= async (req,res)=>{
   try {
      
    let getExtraInfor = await doctorService.getExtraInforDoctorByIdService(req.query.id);
    return res.status(200).json(getExtraInfor);
  
    } catch (e) {
      return res.status(200).json({
        errCode: -1,
        errMessage: "Error from the server",
      });
    }
}

let getProfileInforDoctorById= async (req,res)=>{
   try {
      
    let getProfileInfor = await doctorService.getProfileInforDoctorByIdService(req.query.id);
    return res.status(200).json(getProfileInfor);
  
    } catch (e) {
      return res.status(200).json({
        errCode: -1,
        errMessage: "Error from the server",
      });
    }
}
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctor: getAllDoctor,
  postInforDoctor: postInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule:bulkCreateSchedule,
  getScheduleDoctorByDate:getScheduleDoctorByDate,
  getExtraInforDoctorById:getExtraInforDoctorById,
  getProfileInforDoctorById:getProfileInforDoctorById
};
