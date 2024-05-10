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
      return res.status(200).json({
        errCode: 2,
        errMessage: "Missing required query id",
      });
    }
    let infor = await doctorService.getDetailDoctorByIdService(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctor: getAllDoctor,
  postInforDoctor: postInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
};
