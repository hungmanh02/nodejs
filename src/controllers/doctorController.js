import doctorService from "../services/doctorService";
let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10; // neu khong truyen limit thi lay toi da 10 bang ghi
  try {
    let doctors = await doctorService.getTopDoctorHomeService(limit);
    return res.status(200).json(doctors);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ...",
    });
  }
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
};
