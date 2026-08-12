import Interview from "../models/Interview.js";
import { uploadBuffer } from "../services/cloudinaryService.js";
import { validateInterview } from "../validators/interviewValidator.js";

const create = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data || "{}");
    const validationError = validateInterview(data);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const image = req.files?.candidateImage?.[0];
    const resume = req.files?.resume?.[0];

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Candidate photo is required" });
    }

    if (!resume) {
      return res
        .status(400)
        .json({ success: false, message: "Resume is required" });
    }

    const extension = (resume.originalname.match(/\.[^.]+$/) || [
      "",
    ])[0].toLowerCase();
    const allowedExtensions = [".pdf", ".doc", ".docx"];

    if (!allowedExtensions.includes(extension)) {
      return res.status(400).json({
        success: false,
        message: "Only PDF, DOC and DOCX files are allowed",
      });
    }

    const sanitizedFileName = resume.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_",
    );

    const [uploadedImage, uploadedResume] = await Promise.all([
      uploadBuffer(image.buffer, {
        folder: "visitor-checkin/candidates",
        resourceType: "image",
      }),
      // uploadBuffer(resume.buffer, {
      //   folder: 'visitor-checkin/resumes',
      //   resourceType: 'raw',
      //   publicId: `${Date.now()}-${resume.originalname.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
      // }),
      uploadBuffer(resume.buffer, {
        folder: "visitor-checkin/resumes",
        resourceType: "raw",
        publicId: `${Date.now()}-${sanitizedFileName}`,
        originalFilename: sanitizedFileName,
      }),
    ]);

    const document = await Interview.create({
      candidateInformation: {
        imageUrl: uploadedImage.secure_url,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
      },
      professionalDetails: {
        positionAppliedFor: data.positionAppliedFor,
        source: data.source,
        currentCompanyName: data.currentCompanyName,
        companyType: data.companyType,
        totalExperience: data.totalExperience,
        relevantExperience: data.relevantExperience,
        reasonForChange: data.reasonForChange,
      },
      skillsAndAI: {
        coreTechnicalSkills: data.coreTechnicalSkills || [],
        aiKnowledge: data.aiKnowledge || "",
        aiTools: data.aiTools || [],
      },
      compensation: {
        ctcPerAnnum: data.ctcPerAnnum,
        monthlyTakeHome: data.monthlyTakeHome,
        expectedCtc: data.expectedCtc,
        noticePeriod: data.noticePeriod,
      },
      previousCompanies: data.previousCompanies || [],
      appraisalHistory: data.appraisalHistory || [],
      references: data.references || [],
      resume: {
        url: uploadedResume.secure_url,
        fileName: resume.originalname,
        publicId: uploadedResume.public_id,
      },
    });

    return res.status(201).json({ success: true, data: document });
  } catch (error) {
    return next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const documents = await Interview.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: documents });
  } catch (error) {
    return next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const document = await Interview.findById(req.params.id);

    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    return res.json({ success: true, data: document });
  } catch (error) {
    return next(error);
  }
};

export { create, list, get };
