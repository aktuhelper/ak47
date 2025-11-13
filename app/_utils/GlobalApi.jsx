import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api";
const TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
    },
});

export async function getStudyMaterials({ courseName, branchName = null, semester }) {
    try {
        const normalizedCourse = courseName.toLowerCase();
        const normalizedBranch = branchName?.toLowerCase() || null;
        const normalizedSemester = `sem ${semester}`;

        // Try /subjects first
        const subjectFilters = {
            course: { course_name: { $eq: normalizedCourse } },
            semester: { $eq: normalizedSemester },
        };

        if (normalizedBranch) {
            subjectFilters.branch = { branch_name: { $eq: normalizedBranch } };
        }

        const resSubjects = await axiosClient.get("/subjects", {
            params: {
                filters: subjectFilters,
                populate: {
                    materials: true,
                    course: true,
                    branch: true,
                },
            },
        });

        const subjectData = resSubjects.data?.data || [];

        if (subjectData.length > 0) {
            console.log("✅ Using /subjects data:", subjectData);
            return subjectData.map((item) => ({
                id: item.id,
                subject_name: item.subject_name,
                subject_code: item.subject_code,
                semester: item.semester,
                course: item.course?.course_name,
                branch: item.branch?.branch_name || null,
                materials: item.materials?.map((m) => ({
                    id: m.id,
                    type: m.material_type,
                    year: m.year,
                    link: m.link,
                    file: m.file,
                })) || [],
            }));
        }

        // Fallback to /courses
        console.log("⚠️ No data in /subjects, trying /courses...");

        const resCourses = await axiosClient.get("/courses", {
            params: {
                filters: { course_name: { $eq: normalizedCourse } },
                populate: {
                    subjects: {
                        populate: ["materials", "branch"], // ✅ Populate branch relation
                        filters: {
                            semester: { $eq: normalizedSemester },
                            ...(normalizedBranch && {
                                branch: { branch_name: { $eq: normalizedBranch } }
                            })
                        }
                    },
                },
            },
        });

        const courseData = resCourses.data?.data?.[0];
        const nestedSubjects = courseData?.subjects || [];

        console.log("✅ Using /courses nested subjects:", nestedSubjects);

        return nestedSubjects.map((subj) => ({
            id: subj.id,
            subject_name: subj.subject_name,
            subject_code: subj.subject_code,
            semester: subj.semester,
            course: normalizedCourse,
            branch: subj.branch?.branch_name || normalizedBranch,
            materials: subj.materials?.map((m) => ({
                id: m.id,
                type: m.material_type,
                year: m.year,
                link: m.link,
                file: m.file,
            })) || [],
        }));
    } catch (error) {
        console.error("❌ Error fetching study materials:", error);
        return [];
    }
}
