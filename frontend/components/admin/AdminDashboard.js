"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import {
  LogOut,
  FileText,
  UserRound,
  BriefcaseBusiness,
  X,
  ExternalLink,
} from "lucide-react";
export default function AdminDashboard() {
  const [tab, setTab] = useState("interviews");
  const [interviews, setInterviews] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const [a, b] = await Promise.all([
        api.get("/interviews"),
        api.get("/business-meetings"),
      ]);
      setInterviews(a.data.data || []);
      setMeetings(b.data.data || []);
    } catch (e) {
      if (e.response?.status === 401) window.location.href = "/admin/login";
      else toast.error("Unable to load admin data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const logout = async () => {
    await api.post("/auth/logout");
    window.location.href = "/admin/login";
  };
  const items = tab === "interviews" ? interviews : meetings;
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <div>
          <div className="font-extrabold text-xl">Visitor Check-In Admin</div>
          <div className="text-xs text-slate-400">Submissions overview</div>
        </div>
        <button onClick={logout} className="soft-btn flex items-center gap-2">
          <LogOut size={16} /> Logout
        </button>
      </header>
      <div className="max-w-7xl mx-auto p-5">
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => {
              setTab("interviews");
              setSelected(null);
            }}
            className={tab === "interviews" ? "purple-btn" : "soft-btn"}
          >
            <FileText size={15} className="inline mr-1" /> Interviews (
            {interviews.length})
          </button>
          <button
            onClick={() => {
              setTab("meetings");
              setSelected(null);
            }}
            className={tab === "meetings" ? "purple-btn" : "soft-btn"}
          >
            <BriefcaseBusiness size={15} className="inline mr-1" /> Business
            Meetings ({meetings.length})
          </button>
        </div>
        {loading ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">
            Loading...
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.3fr_.7fr] gap-5">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      {tab === "interviews" ? (
                        <>
                          <th className="p-3">Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Position</th>
                          <th className="p-3">Experience</th>
                          <th className="p-3">Submitted</th>
                        </>
                      ) : (
                        <>
                          <th className="p-3">Visitor</th>
                          <th className="p-3">Company</th>
                          <th className="p-3">Person To Meet</th>
                          <th className="p-3">Purpose</th>
                          <th className="p-3">Submitted</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item._id}
                        onClick={() => setSelected(item)}
                        className="border-t border-slate-100 hover:bg-orange-50 cursor-pointer"
                      >
                        {tab === "interviews" ? (
                          <>
                            <td className="p-3 font-semibold">
                              {item.candidateInformation?.fullName}
                            </td>
                            <td className="p-3">
                              {item.candidateInformation?.email}
                            </td>
                            <td className="p-3">
                              {item.professionalDetails?.positionAppliedFor}
                            </td>
                            <td className="p-3">
                              {item.professionalDetails?.totalExperience || "-"}
                            </td>
                            <td className="p-3 text-xs text-slate-400">
                              {new Date(item.createdAt).toLocaleString()}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-3 font-semibold">
                              {item.fullName}
                            </td>
                            <td className="p-3">{item.companyName}</td>
                            <td className="p-3">{item.personToMeet?.name}</td>
                            <td className="p-3">{item.purposeOfVisit}</td>
                            <td className="p-3 text-xs text-slate-400">
                              {new Date(item.createdAt).toLocaleString()}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {!items.length && (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-10 text-center text-slate-400"
                        >
                          No submissions yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 min-h-[450px]">
              {!selected ? (
                <div className="h-full flex items-center justify-center text-center text-slate-400">
                  <UserRound className="mx-auto mb-2" />
                  <div>Select a submission to view details.</div>
                </div>
              ) : tab === "interviews" ? (
                <InterviewDetails
                  item={selected}
                  close={() => setSelected(null)}
                />
              ) : (
                <MeetingDetails
                  item={selected}
                  close={() => setSelected(null)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function Row({ label, value }) {
  return (
    <div className="py-2 border-b border-slate-100">
      <div className="text-[10px] uppercase font-bold text-slate-400">
        {label}
      </div>
      <div className="text-sm mt-1 wrap-break-word">{value || "-"}</div>
    </div>
  );
}

function InterviewDetails({ item, close }) {
  return (
    <div>
      <div className="flex justify-between items-start">
        <h2 className="font-extrabold text-lg">
          Interview Details
        </h2>

        <button onClick={close}>
          <X size={18} />
        </button>
      </div>

      {/* Candidate Photo */}
      {item.candidateInformation?.imageUrl ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-3">
            Candidate Photo
          </div>

          <div className="flex items-center gap-4">
            <img
              src={item.candidateInformation.imageUrl}
              alt={`${item.candidateInformation?.fullName || 'Candidate'} photo`}
              className="w-28 h-28 rounded-xl object-cover border border-slate-200 bg-white"
            />
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <div className="text-sm text-slate-400">
            Candidate photo not available
          </div>
        </div>
      )}

      {/* Candidate Details */}
      <div className="space-y-1 mt-3">
        <Row
          label="Candidate"
          value={item.candidateInformation?.fullName}
        />

        <Row
          label="Phone"
          value={item.candidateInformation?.phone}
        />

        <Row
          label="Email"
          value={item.candidateInformation?.email}
        />

        <Row
          label="DOB"
          value={
            item.candidateInformation?.dateOfBirth &&
            new Date(
              item.candidateInformation.dateOfBirth
            ).toLocaleDateString()
          }
        />

        <Row
          label="Position"
          value={item.professionalDetails?.positionAppliedFor}
        />

        <Row
          label="Source"
          value={item.professionalDetails?.source}
        />

        <Row
          label="Current Company"
          value={item.professionalDetails?.currentCompanyName}
        />

        <Row
          label="Company Type"
          value={item.professionalDetails?.companyType}
        />

        <Row
          label="Total Experience"
          value={item.professionalDetails?.totalExperience}
        />

        <Row
          label="Relevant Experience"
          value={item.professionalDetails?.relevantExperience}
        />

        <Row
          label="Reason for Change"
          value={item.professionalDetails?.reasonForChange}
        />

        <Row
          label="Technical Skills"
          value={item.skillsAndAI?.coreTechnicalSkills?.join(', ')}
        />

        <Row
          label="AI Knowledge"
          value={item.skillsAndAI?.aiKnowledge}
        />

        <Row
          label="AI Tools"
          value={item.skillsAndAI?.aiTools?.join(', ')}
        />

        <Row
          label="Compensation"
          value={`CTC: ${
            item.compensation?.ctcPerAnnum || '-'
          } | Take Home: ${
            item.compensation?.monthlyTakeHome || '-'
          } | Expected: ${
            item.compensation?.expectedCtc || '-'
          } | Notice: ${
            item.compensation?.noticePeriod || '-'
          }`}
        />

        <Row
          label="Previous Companies"
          value={item.previousCompanies
            ?.map(
              (company) =>
                `${company.companyName} (${company.ctcPerAnnum})`
            )
            .join(', ')}
        />

        <Row
          label="Appraisals"
          value={item.appraisalHistory
            ?.map(
              (appraisal) =>
                `${appraisal.year}: ${appraisal.appraisalPercentage}%`
            )
            .join(', ')}
        />

        <Row
          label="References"
          value={item.references
            ?.map(
              (reference) =>
                `${reference.name} (${reference.phone})`
            )
            .join(', ')}
        />
      </div>

      {/* Resume */}
      {item.resume?.url && (
        <a
          className="orange-btn inline-flex items-center gap-2 mt-4"
          target="_blank"
          rel="noreferrer"
          href={item.resume.url}
        >
          Open Resume
          <ExternalLink size={15} />
        </a>
      )}
    </div>
  );
}

function MeetingDetails({ item, close }) {
  return (
    <div>
      <div className="flex justify-between items-start">
        <h2 className="font-extrabold text-lg">Business Meeting Details</h2>
        <button onClick={close}>
          <X size={18} />
        </button>
      </div>
      {item.visitorPhotoUrl && (
        <img
          src={item.visitorPhotoUrl}
          alt="Visitor"
          className="w-28 h-28 rounded-full object-cover mt-4"
        />
      )}
      <div className="space-y-1 mt-3">
        <Row label="Visitor" value={item.fullName} />
        <Row label="Phone" value={item.mobileNumber} />
        <Row label="Email" value={item.email} />
        <Row label="Company" value={item.companyName} />
        <Row label="Person To Meet" value={item.personToMeet?.name} />
        <Row label="Purpose" value={item.purposeOfVisit} />
        <Row label="Address" value={item.address} />
        <Row
          label="Submitted"
          value={new Date(item.createdAt).toLocaleString()}
        />
      </div>
    </div>
  );
}
