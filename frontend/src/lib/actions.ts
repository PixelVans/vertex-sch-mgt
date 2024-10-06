"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
  ExamSchema,
  ParentSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (currentState: CurrentState, data: SubjectSchema) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          create: data.teachers.map((teacherId) => ({
            teacher: { connect: { ud: teacherId } }, // Connect the existing teacher by 'ud'
          
          })),
        },
      },
    });
  
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};





export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    // Validate that the teacher IDs exist (optional step for data integrity)
    const existingTeachers = await prisma.teacher.findMany({
      where: {
        ud: { in: data.teachers } // assuming data.teachers is an array of teacher UDs
      }
    });

    // Extracting existing teacher IDs
    const validTeacherIds = existingTeachers.map(teacher => teacher.ud);

    // Update subject
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        // Set the relations to the TeacherSubject model
        teachers: {
          deleteMany: {}, // Optionally clear existing relationships first
          create: validTeacherIds.map(teacherUd => ({
            teacherId: teacherUd, // Correct field for teacher
            // subjectId is not needed here
          })),
        }
      }
    });
  
    return { success: true, error: false };
  } catch (err) {
    console.error("Error during subject update:", err);
    return { success: false, error: true };
  }
};



export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    // First, delete related lessons
    await prisma.lesson.deleteMany({
      where: { subjectId: id }, // Find lessons related to the subject
    });

    // Now delete the subject
    await prisma.subject.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const createParent = async (data: ParentSchema) => {
  try {
    const client = clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "parent" }
    });

    await prisma.parent.create({
      data: {
        ud: user.id,
        phone: data.phone,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        address: data.address,
        students: {
          connect: (data.students || []).map((studentUd) => ({
            ud: studentUd, // Connect students by their 'ud' field
          })),
        },
      },
    });

    return { success: true, error: false };

  } catch (err:any) {
    let errorMessages = [];

    // Check if the error has the specific format you expect
    if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
      // Iterate through the errors and capture their messages
      errorMessages = err.errors.map((error:any) => error.message);
    } else if (err instanceof Error) {
      // Capture the standard error message if it's not in the expected format
      errorMessages.push(err.message);
    }

    console.log(err); // Log the full error for debugging
    return { success: false, error: true, messages: errorMessages };
  }
};

export const updateParent = async (data: ParentSchema) => {
  try {
    const client = clerkClient();
    
    // Update the user details in Clerk
    const user = await client.users.updateUser(data.ud, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }), // Only update password if it's provided
      firstName: data.name,
      lastName: data.surname,
    });

    // Update the parent details in your database
    await prisma.parent.update({
      where: { ud: data.ud }, // Assuming 'ud' is the unique identifier for the parent
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        students: {
          connect: (data.students || []).map((studentUd) => ({
            ud: studentUd, // Connect students by their 'ud' field
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    let errorMessages = [];

    // Check if the error has the specific format you expect
    if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
      // Iterate through the errors and capture their messages
      errorMessages = err.errors.map((error: any) => error.message);
    } else if (err instanceof Error) {
      // Capture the standard error message if it's not in the expected format
      errorMessages.push(err.message);
    }

    console.log(err); // Log the full error for debugging
    return { success: false, error: true, messages: errorMessages };
  }
};


export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string; // Extract the ID from the form data
  
  try {
    // First, delete the user from Clerk
    await clerkClient.users.deleteUser(id);

    // Optionally, delete related data from your database
    // For example, if you want to remove any related records in Attendance, etc.

    // await prisma.attendance.deleteMany({
    //   where: {
    //     parentId: id, // Adjust based on your schema
    //   },
    // });

    // Finally, delete the parent record from the database
    await prisma.parent.delete({
      where: {
        ud: id, // Assuming 'ud' is the unique identifier for the parent
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};












export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    console.log(data)

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    // await prisma.class.update({
    //   where: {
    //     id: data.id,
    //   },
    //   data,
    // });
    console.log(data)
    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {

    console.log(data)
    // await prisma.class.delete({
    //   where: {
    //     id: parseInt(id),
    //   },
    // });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const client = clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"teacher"}
    });
   
    
    
    await prisma.teacher.create({
      data: {
        ud: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          create: (data.subjects || []).map((subjectId) => ({
            subject: { connect: { id: subjectId } },
          })),
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};




export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
    
  if (!data.id) {
    return { success: false, error: true };
  }

  try {
    const client = clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        ud: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          
          create: (data.subjects || []).map(subjectid => ({
            subjectId: subjectid, // Correct field for teacher
            // subjectId is not needed here
          })),
        }
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  }  catch (err) {
    console.error(err); // Log the error for debugging
    const errorMessage = err 

    return { success: false, error: true }; // Return the error message
  }
};






export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
 
) => {
  
  const id = data.get("id") as string;
  console.log(id)
  try {
    await clerkClient.users.deleteUser(id);


    // //optionally deleting the related fields
    // await prisma.attendance.deleteMany({
    //   where: {
    //     lesson: {
    //       teacherId: id
    //     }
    //   }
    // });

    // // Then, delete the related Lessons
    // await prisma.lesson.deleteMany({
    //   where: { teacherId: id },
    // });

    // // Finally, delete the teacher
    // await prisma.teacher.delete({
    //   where: {
    //     ud: id,
    //   },
    // });


    await prisma.teacher.delete({
      where: {
        ud: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};










export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data);
  try {
    // const classItem = await prisma.class.findUnique({
    //   where: { id: data.classId },
    //   include: { _count: { select: { students: true } } },
    // });

    // if (classItem && classItem.capacity === classItem._count.students) {
    //   return { success: false, error: true };
    // }

    // const user = await clerkClient.users.createUser({
    //   username: data.username,
    //   password: data.password,
    //   firstName: data.name,
    //   lastName: data.surname,
    //   publicMetadata:{role:"student"}
    // });

    // await prisma.student.create({
    //   data: {
    //     id: user.id,
    //     username: data.username,
    //     name: data.name,
    //     surname: data.surname,
    //     email: data.email || null,
    //     phone: data.phone || null,
    //     address: data.address,
    //     img: data.img || null,
    //     bloodType: data.bloodType,
    //     sex: data.sex,
    //     birthday: data.birthday,
    //     gradeId: data.gradeId,
    //     classId: data.classId,
    //     parentId: data.parentId,
    //   },
    // });
    console.log(data)
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    console.log(data)
    // const user = await clerkClient.users.updateUser(data.id, {
    //   username: data.username,
    //   ...(data.password !== "" && { password: data.password }),
    //   firstName: data.name,
    //   lastName: data.surname,
    // });

    // await prisma.student.update({
    //   where: {
    //     id: data.id,
    //   },
    //   data: {
    //     ...(data.password !== "" && { password: data.password }),
    //     username: data.username,
    //     name: data.name,
    //     surname: data.surname,
    //     email: data.email || null,
    //     phone: data.phone || null,
    //     address: data.address,
    //     img: data.img || null,
    //     bloodType: data.bloodType,
    //     sex: data.sex,
    //     birthday: data.birthday,
    //     gradeId: data.gradeId,
    //     classId: data.classId,
    //     parentId: data.parentId,
    //   },
    // });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    console.log(data)
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    // await prisma.exam.create({
    //   data: {
    //     title: data.title,
    //     startTime: data.startTime,
    //     endTime: data.endTime,
    //     lessonId: data.lessonId,
    //   },
    // });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    // await prisma.exam.update({
    //   where: {
    //     id: data.id,
    //   },
    //   data: {
    //     title: data.title,
    //     startTime: data.startTime,
    //     endTime: data.endTime,
    //     lessonId: data.lessonId,
    //   },
    // });
    console.log(data)
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // await prisma.exam.delete({
    //   where: {
    //     id: parseInt(id),
    //     // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
    //   },
    // });
    console.log(data)
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};