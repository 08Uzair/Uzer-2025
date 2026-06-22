import { toast } from "react-toastify";

const cloudName = "dq4ibthcc";
const uploadPreset = "blogApp";

export const uploadImageToCloudinary = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log(data.secure_url);
    toast.success("Image Uploaded Sucessfully");
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};





// "
// https://apiv4.lineupx.com/Candidate/Jobs/GET/GetActiveJobsV2?candidate_id=69df32f297c333ddc34d5387&page=1&perPage=100&sortField=createdAt&sortOrder=-1&searchVal=&job_type=&application_status=&experience_range=&location=&office_policy=&posted_by=&ctc_range=&job_status=&type=&posted_in=&programs=&page_type=&industry=&pay_filter=&benefits=&employer_contacts=&recommended=&job_role=&employer_name=&jobs_by=&stipend_range=[]&is_pinned=true
// Request Method
// GET
// Status Code
// 200 OK
// Remote Address
// 34.49.228.19:443
// Referrer Policy
// strict-origin-when-cross-origin"



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODIwNTA0MDUsImlhdCI6MTc4MTAxMzYwNSwidXNlciI6eyJfaWQiOiI2OWRmMzJmMjk3YzMzM2RkYzM0ZDUzODciLCJhY2NvdW50X3R5cGUiOiJDYW5kaWRhdGUiLCJhZ2VuY3lfaWQiOiI2OWNiOTcwZWNlNDI0ZDE5MzhlZDA5ZmEiLCJlbWFpbCI6InF1cmVzaGltb2hhbW1hZHV6ZXJuaXphbW9kZGluQGFtaXR5b25saW5lLmNvbSJ9fQ.ndubHkvTxjA8Fsmk4KdGp4vF89K5er4A5vbXooDuvI0


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODIwMTE0NDgsImlhdCI6MTc4MDk3NDY0OCwidXNlciI6eyJfaWQiOiI2OWRmMzJmMjk3YzMzM2RkYzM0ZDUzODciLCJhY2NvdW50X3R5cGUiOiJDYW5kaWRhdGUiLCJhZ2VuY3lfaWQiOiI2OWNiOTcwZWNlNDI0ZDE5MzhlZDA5ZmEiLCJlbWFpbCI6InF1cmVzaGltb2hhbW1hZHV6ZXJuaXphbW9kZGluQGFtaXR5b25saW5lLmNvbSJ9fQ.kdN9Xlni16Lwx5r7iBHHk2Wma_9IUmcovFCcaFYtH9k