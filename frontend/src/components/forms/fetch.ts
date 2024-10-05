"use server"
import prisma from "@/lib/prisma";

export const allstudents = async () => {
    const parentStudents = await prisma.student.findMany({
      select: { ud: true, name: true },
    });
    const students = parentStudents
    console.log(students)
    }