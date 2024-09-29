
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();


// async function cleanup() {
//   // Delete all data from the tables in the correct order to avoid foreign key issues
//   await prisma.attendance.deleteMany({});
//   await prisma.result.deleteMany({});
//   await prisma.exam.deleteMany({});
//   await prisma.assignment.deleteMany({});
//   await prisma.student.deleteMany({});
//   await prisma.parent.deleteMany({});
//   await prisma.lesson.deleteMany({});
//   await prisma.teacher.deleteMany({});
//   await prisma.class.deleteMany({});
//   await prisma.subject.deleteMany({});
//   await prisma.grade.deleteMany({});
//   await prisma.admin.deleteMany({});
//   console.log("All data deleted.");
// }




// async function main() {
 
//   await cleanup();
//   // Step 1: Create Admin
//   const admin = await prisma.admin.create({
//     data: {
//       username: "admin1",
     
//     },
//   });

//   // Step 2: Create Parents
//   const parents = await Promise.all([
//     prisma.parent.create({
//       data: {
//         username: "parent1",
//         name: "John",
//         surname: "Doe",
//         email: "johndoe@example.com",
//         phone: "1234567890",
//         address: "123 Main St",
//       },
//     }),
//     prisma.parent.create({
//       data: {
//         username: "parent2",
//         name: "Jane",
//         surname: "Doe",
//         email: "janedoe@example.com",
//         phone: "0987654321",
//         address: "456 Side St",
//       },
//     }),
//   ]);

//   // Step 3: Create Grades
//   const grades = await Promise.all([
//     prisma.grade.create({ data: { level: 1 } }),
//     prisma.grade.create({ data: { level: 2 } }),
//     prisma.grade.create({ data: { level: 3 } }),
//     prisma.grade.create({ data: { level: 4 } }),
//     prisma.grade.create({ data: { level: 5 } }),
//     prisma.grade.create({ data: { level: 6 } }),
//     prisma.grade.create({ data: { level: 7 } }),
//     prisma.grade.create({ data: { level: 8 } }),
//     prisma.grade.create({ data: { level: 9 } }),
//     prisma.grade.create({ data: { level: 10 } }),
//   ]);

//   // Step 4: Create Classes
//   const classes = await Promise.all([
//     prisma.class.create({
//       data: {
//         name: "Class A",
//         capacity: 30,
//         gradeId: grades[0].id,
//         supervisorId: admin.id,
//       },
//     }),
//     prisma.class.create({
//       data: {
//         name: "Class B",
//         capacity: 30,
//         gradeId: grades[1].id,
//         supervisorId: admin.id,
//       },
//     }),
//     prisma.class.create({
//       data: {
//         name: "Class C",
//         capacity: 30,
//         gradeId: grades[2].id,
//         supervisorId: admin.id,
//       },
//     }),
//     prisma.class.create({
//       data: {
//         name: "Class D",
//         capacity: 30,
//         gradeId: grades[3].id,
//         supervisorId: admin.id,
//       },
//     }),
//     prisma.class.create({
//       data: {
//         name: "Class E",
//         capacity: 30,
//         gradeId: grades[4].id,
//         supervisorId: admin.id,
//       },
//     }),
//   ]);

//   // Step 5: Create Students (2 students per parent)
//   const students = await Promise.all(
//     Array.from({ length: 20 }).map((_, index) => {
//       const parentId = index % 2 === 0 ? parents[0].id : parents[1].id;
//       const classId = classes[index % classes.length].id;
//       const gradeId = grades[Math.floor(index / 2)].id; // Distribute students evenly among grades

//       return prisma.student.create({
//         data: {
//           username: `student${index + 1}`,
//           name: `Student ${index + 1}`,
//           surname: `Surname ${index + 1}`,
//           email: `student${index + 1}@example.com`,
//           phone: `12345678${index}`,
//           address: `Student Address ${index + 1}`,
//           img: `link_to_student_img_${index + 1}`,
//           bloodType: "A+",
//           sex: index % 2 === 0 ? "FEMALE" : "MALE",
//           parentId,
//           classId,
//           gradeId,
//           birthday: new Date(`2005-04-${(index % 30) + 1}`),
//         },
//       });
//     })
//   );

//   // Step 6: Create Subjects
//   const subjects = await Promise.all([
//     prisma.subject.create({ data: { name: "Math" } }),
//     prisma.subject.create({ data: { name: "Science" } }),
//     prisma.subject.create({ data: { name: "History" } }),
//     prisma.subject.create({ data: { name: "Literature" } }),
//     prisma.subject.create({ data: { name: "Art" } }),
//   ]);

//   // Step 7: Create Teachers
//   const teachers = await Promise.all([
//     prisma.teacher.create({
//       data: {
//         username: "teacher1",
//         name: "Alice",
//         surname: "Johnson",
//         email: "alice@example.com",
//         phone: "1112223333",
//         address: "789 Teacher St",
//         bloodType: "B+",
//         sex: "FEMALE",
//         birthday: new Date('1985-06-15'),
//       },
//     }),
//     prisma.teacher.create({
//       data: {
//         username: "teacher2",
//         name: "Bob",
//         surname: "Smith",
//         email: "bob@example.com",
//         phone: "4445556666",
//         address: "321 Teacher Rd",
//         bloodType: "O-",
//         sex: "MALE",
//         birthday: new Date('1980-04-22'),
//       },
//     }),
//     prisma.teacher.create({
//       data: {
//         username: "teacher3",
//         name: "Cathy",
//         surname: "Williams",
//         email: "cathy@example.com",
//         phone: "7778889999",
//         address: "654 Teacher Blvd",
//         bloodType: "A-",
//         sex: "FEMALE",
//         birthday: new Date('1990-12-30'),
//       },
//     }),
//   ]);

//   // Step 8: Create Lessons
//   const lessons = await Promise.all([
//     prisma.lesson.create({
//       data: {
//         name: "Math Lesson 1",
//         day: "MONDAY",
//         startTime: new Date("2024-09-30T08:00:00Z"),
//         endTime: new Date("2024-09-30T09:00:00Z"),
//         subjectId: subjects[0].id,
//         classId: classes[0].id,
//         teacherId: teachers[0].id,
//       },
//     }),
//     prisma.lesson.create({
//       data: {
//         name: "Science Lesson 1",
//         day: "TUESDAY",
//         startTime: new Date("2024-09-30T09:00:00Z"),
//         endTime: new Date("2024-09-30T10:00:00Z"),
//         subjectId: subjects[1].id,
//         classId: classes[1].id,
//         teacherId: teachers[1].id,
//       },
//     }),
//     prisma.lesson.create({
//       data: {
//         name: "History Lesson 1",
//         day: "WEDNESDAY",
//         startTime: new Date("2024-09-30T10:00:00Z"),
//         endTime: new Date("2024-09-30T11:00:00Z"),
//         subjectId: subjects[2].id,
//         classId: classes[2].id,
//         teacherId: teachers[2].id,
//       },
//     }),
//   ]);

//   // Step 9: Create Exams
//   const exams = await Promise.all([
//     prisma.exam.create({
//       data: {
//         title: "Math Exam 1",
//         startTime: new Date("2024-10-15T10:00:00Z"),
//         endTime: new Date("2024-10-15T12:00:00Z"),
//         lessonId: lessons[0].id,
//       },
//     }),
//     prisma.exam.create({
//       data: {
//         title: "Science Exam 1",
//         startTime: new Date("2024-10-16T10:00:00Z"),
//         endTime: new Date("2024-10-16T12:00:00Z"),
//         lessonId: lessons[1].id,
//       },
//     }),
//     prisma.exam.create({
//       data: {
//         title: "History Exam 1",
//         startTime: new Date("2024-10-17T10:00:00Z"),
//         endTime: new Date("2024-10-17T12:00:00Z"),
//         lessonId: lessons[2].id,
//       },
//     }),
//   ]);

//   // Step 10: Create Assignments
//   const assignments = await Promise.all([
//     prisma.assignment.create({
//       data: {
//         title: "Math Assignment 1",
//         startDate: new Date("2024-09-30"),
//         dueDate: new Date("2024-10-07"),
//         lessonId: lessons[0].id,
//       },
//     }),
//     prisma.assignment.create({
//       data: {
//         title: "Science Assignment 1",
//         startDate: new Date("2024-09-30"),
//         dueDate: new Date("2024-10-08"),
//         lessonId: lessons[1].id,
//       },
//     }),
//     prisma.assignment.create({
//       data: {
//         title: "History Assignment 1",
//         startDate: new Date("2024-09-30"),
//         dueDate: new Date("2024-10-09"),
//         lessonId: lessons[2].id,
//       },
//     }),
//   ]);


// // announcements
// const announcements = await Promise.all([
//   prisma.announcement.create({
//     data: {
//       title: "First Day of School Announcement",
//       description: "Welcome back to school! Please check your schedules.",
//       date: new Date(),
//       classId: classes[0].id, // linking to the first class
//     },
//   }),
//   prisma.announcement.create({
//     data: {
//       title: "Midterm Exam Schedule",
//       description: "The schedule for midterm exams is now available.",
//       date: new Date(),
//       classId: classes[1].id, // linking to the second class
//     },
//   }),
//   prisma.announcement.create({
//     data: {
//       title: "Parent-Teacher Meeting",
//       description: "A reminder for the upcoming parent-teacher meeting next week.",
//       date: new Date(),
//       classId: classes[2].id, // linking to the third class
//     },
//   }),
// ]);


//   // Step 12: Create Events with Complete Fields
//   const events = await Promise.all([
//     prisma.event.create({
//       data: {
//         title: "School Picnic",
//         description: "A fun day out for students and parents.",
//         startTime: new Date("2024-10-15T10:00:00Z"),
//         endTime: new Date("2024-10-15T16:00:00Z"),
//         classId: classes[0].id, // Optional class association
//       },
//     }),
//     prisma.event.create({
//       data: {
//         title: "Science Fair",
//         description: "Showcasing student projects in science.",
//         startTime: new Date("2024-10-22T09:00:00Z"),
//         endTime: new Date("2024-10-22T15:00:00Z"),
//         classId: classes[1].id, // Optional class association
//       },
//     }),
//     prisma.event.create({
//       data: {
//         title: "Graduation Ceremony",
//         description: "Celebrating the achievements of our graduates.",
//         startTime: new Date("2024-11-01T13:00:00Z"),
//         endTime: new Date("2024-11-01T16:00:00Z"),
//         classId: classes[2].id, // Optional class association
//       },
//     }),
//   ]);

//   // Step 13: Create Attendance Records
//   const attendances = await Promise.all(
//     students.map((student, index) => {
//       return prisma.attendance.create({
//         data: {
//           date: new Date(`2024-09-${(index % 30) + 1}`),
//           present: index % 2 === 0, // Half present, half absent
//           studentId: student.id,
//           lessonId: lessons[index % lessons.length].id,
//         },
//       });
//     })
//   );

//   // Step 14: Create Results Records
//   const results = await Promise.all(
//     students.map((student, index) => {
//       return prisma.result.create({
//         data: {
//           score: Math.floor(Math.random() * 100), // Random score
//           studentId: student.id,
//           examId: exams[index % exams.length].id,
//         },
//       });
//     })
//   );

//   console.log("Database seeded successfully!");
// }

// main()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


















import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function cleanup() {
  // Delete all data from the tables in the correct order to avoid foreign key issues
  await prisma.attendance.deleteMany({});
  await prisma.result.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.parent.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.class.deleteMany({}); // Delete classes before teachers
  await prisma.teacher.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.grade.deleteMany({});
  await prisma.admin.deleteMany({});
  console.log("All data deleted.");
}




async function main() {
 
  await cleanup();
  // Step 1: Create Admin
  const admin = await prisma.admin.create({
    data: {
      username: "admin1",
      ud: "admin001",
     
    },
  });

  // Step 2: Create Parents
  const parents = await Promise.all([
    prisma.parent.create({
      data: {
        ud : 'parent001',
        username: "parent1",
        name: "John",
        surname: "Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        address: "123 Main St",
      },
    }),
    prisma.parent.create({
      data: {
        ud : 'parent002',
        username: "parent2",
        name: "Harry",
        surname: "sprawl",
        email: "harry@example.com",
        phone: "0987614321",
        address: "456 Side St",
      },
    }),
    prisma.parent.create({
      data: {
        ud : 'parent003',
        username: "parent3",
        name: "Eva",
        surname: "madson",
        email: "emma@example.com",
        phone: "0987354321",
        address: "456 Side St",
      },
    }),
    prisma.parent.create({
      data: {
        ud : 'parent004',
        username: "parent4",
        name: "Chris",
        surname: "Owen",
        email: "Chris@example.com",
        phone: "0982654321",
        address: "456 Side St",
      },
    }),
  ]);





    // Step 7: Create Teachers
    const teachers = await Promise.all([
      prisma.teacher.create({
        data: {
          ud: "teacher001",
          username: "teacher1",
          name: "Alice",
          surname: "Johnson",
          email: "alice@example.com",
          phone: "1112223333",
          address: "789 Teacher St",
          bloodType: "B+",
          sex: "FEMALE",
          birthday: new Date('1985-06-15'),
        },
      }),
      prisma.teacher.create({
        data: {
          ud: "teacher002",
          username: "teacher2",
          name: "Bob",
          surname: "Smith",
          email: "bob@example.com",
          phone: "4445556666",
          address: "321 Teacher Rd",
          bloodType: "O-",
          sex: "MALE",
          birthday: new Date('1980-04-22'),
        },
      }),
      prisma.teacher.create({
        data: {
          ud: "teacher003",
          username: "teacher3",
          name: "Cathy",
          surname: "Williams",
          email: "cathy@example.com",
          phone: "7778889999",
          address: "634 Teacher Blvd",
          bloodType: "A-",
          sex: "FEMALE",
          birthday: new Date('1990-12-30'),
        },
      }),
      prisma.teacher.create({
        data: {
          ud: "teacher004",
          username: "teacher4",
          name: "Vans",
          surname: "pixel",
          email: "vans@example.com",
          phone: "878829999",
          address: "614 Teacher Blvd",
          bloodType: "B-",
          sex: "MALE",
          birthday: new Date('1989-01-01'),
        },
      }),
      prisma.teacher.create({
        data: {
          ud: "teacher005",
          username: "teacher5",
          name: "Olivia",
          surname: "rose",
          email: "ollie@example.com",
          phone: "878839999",
          address: "654 Teacher Blvd",
          bloodType: "B",
          sex: "MALE",
          birthday: new Date('1990-11-01'),
        },
      }),
    ]);

  // Step 3: Create Grades
  const grades = await Promise.all([
    prisma.grade.create({ data: { level: 1 } }),
    prisma.grade.create({ data: { level: 2 } }),
    prisma.grade.create({ data: { level: 3 } }),
    prisma.grade.create({ data: { level: 4 } }),
    prisma.grade.create({ data: { level: 5 } }),
    prisma.grade.create({ data: { level: 6 } }),
    prisma.grade.create({ data: { level: 7 } }),
    prisma.grade.create({ data: { level: 8 } }),
    prisma.grade.create({ data: { level: 9 } }),
    prisma.grade.create({ data: { level: 10 } }),
  ]);

    // Step 4: Create Classes
    const classes = await Promise.all([
      prisma.class.create({
        data: {
          name: "Class A",
          capacity: 22,
          gradeId: grades[0].id,
          supervisorId: teachers[0].ud,
        },
      }),
      prisma.class.create({
        data: {
          name: "Class B",
          capacity: 31,
          gradeId: grades[1].id,
          supervisorId: teachers[1].ud,
        },
      }),
      prisma.class.create({
        data: {
          name: "Class C",
          capacity: 47,
          gradeId: grades[2].id,
          supervisorId: teachers[2].ud,
        },
      }),
      prisma.class.create({
        data: {
          name: "Class D",
          capacity: 33,
          gradeId: grades[3].id,
          supervisorId: teachers[3].ud,
        },
      }),
      prisma.class.create({
        data: {
          name: "Class E",
          capacity: 20,
          gradeId: grades[4].id,
          supervisorId: teachers[4].ud,
        },
      }),
    ]);
  
  
  
  
  
  //create students
    const students = await Promise.all(
      Array.from({ length: 20 }).map((_, index) => {
        const parentId = parents[index % parents.length].ud;  // Use 'ud' instead of 'id'

        const classId = classes[index % classes.length].id;
        const gradeId = grades[Math.floor(index / 2)].id; // Distribute students evenly among grades
    
        return prisma.student.create({
          data: {
            ud: `student00${index + 1}`,
            username: `student${index + 1}`,
            name: `Student ${index + 1}`,
            surname: `Surname ${index + 1}`,
            email: `student${index + 1}@example.com`,
            phone: `12345678${index}`,
            address: `Student Address ${index + 1}`,
            img: `link_to_student_img_${index + 1}`,
            bloodType: "A+",
            sex: index % 2 === 0 ? "FEMALE" : "MALE",
            parentId, // Now uses the updated logic for round-robin distribution
            classId,
            gradeId,
            birthday: new Date(`2005-04-${(index % 30) + 1}`),
          },
        });
      })
    );
    

  // Step 6: Create Subjects
  const subjects = await Promise.all([
    prisma.subject.create({ data: { name: "Math" } }),
    prisma.subject.create({ data: { name: "Science" } }),
    prisma.subject.create({ data: { name: "History" } }),
    prisma.subject.create({ data: { name: "Literature" } }),
    prisma.subject.create({ data: { name: "Art" } }),
  ]);



  // Step 8: Create Lessons
  const lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        name: "Math Lesson 1",
        day: "MONDAY",
        startTime: new Date("2024-09-30T08:00:00Z"),
        endTime: new Date("2024-09-30T09:00:00Z"),
        subjectId: subjects[0].id,
        classId: classes[0].id,
        teacherId: teachers[0].ud,
      },
    }),
    prisma.lesson.create({
      data: {
        name: "Science Lesson 1",
        day: "TUESDAY",
        startTime: new Date("2024-09-30T09:00:00Z"),
        endTime: new Date("2024-09-30T10:00:00Z"),
        subjectId: subjects[1].id,
        classId: classes[1].id,
        teacherId: teachers[1].ud,
      },
    }),
    prisma.lesson.create({
      data: {
        name: "History Lesson 1",
        day: "WEDNESDAY",
        startTime: new Date("2024-09-30T10:00:00Z"),
        endTime: new Date("2024-09-30T11:00:00Z"),
        subjectId: subjects[2].id,
        classId: classes[2].id,
        teacherId: teachers[2].ud,
      },
    }),
  ]);

  // Step 9: Create Exams
  const exams = await Promise.all([
    prisma.exam.create({
      data: {
        title: "Math Exam 1",
        startTime: new Date("2024-10-15T10:00:00Z"),
        endTime: new Date("2024-10-15T12:00:00Z"),
        lessonId: lessons[0].id,
      },
    }),
    prisma.exam.create({
      data: {
        title: "Science Exam 1",
        startTime: new Date("2024-10-16T10:00:00Z"),
        endTime: new Date("2024-10-16T12:00:00Z"),
        lessonId: lessons[1].id,
      },
    }),
    prisma.exam.create({
      data: {
        title: "History Exam 1",
        startTime: new Date("2024-10-17T10:00:00Z"),
        endTime: new Date("2024-10-17T12:00:00Z"),
        lessonId: lessons[2].id,
      },
    }),
  ]);

  // Step 10: Create Assignments
  const assignments = await Promise.all([
    prisma.assignment.create({
      data: {
        title: "Math Assignment 1",
        startDate: new Date("2024-09-30"),
        dueDate: new Date("2024-10-07"),
        lessonId: lessons[0].id,
      },
    }),
    prisma.assignment.create({
      data: {
        title: "Science Assignment 1",
        startDate: new Date("2024-09-30"),
        dueDate: new Date("2024-10-08"),
        lessonId: lessons[1].id,
      },
    }),
    prisma.assignment.create({
      data: {
        title: "History Assignment 1",
        startDate: new Date("2024-09-30"),
        dueDate: new Date("2024-10-09"),
        lessonId: lessons[2].id,
      },
    }),
  ]);


// announcements
const announcements = await Promise.all([
  prisma.announcement.create({
    data: {
      title: "First Day of School Announcement",
      description: "Welcome back to school! Please check your schedules.",
      date: new Date(),
      classId: classes[0].id, // linking to the first class
    },
  }),
  prisma.announcement.create({
    data: {
      title: "Midterm Exam Schedule",
      description: "The schedule for midterm exams is now available.",
      date: new Date(),
      classId: classes[1].id, // linking to the second class
    },
  }),
  prisma.announcement.create({
    data: {
      title: "Parent-Teacher Meeting",
      description: "A reminder for the upcoming parent-teacher meeting next week.",
      date: new Date(),
      classId: classes[2].id, // linking to the third class
    },
  }),
]);


  // Step 12: Create Events with Complete Fields
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "School Picnic",
        description: "A fun day out for students and parents.",
        startTime: new Date("2024-10-15T10:00:00Z"),
        endTime: new Date("2024-10-15T16:00:00Z"),
        classId: classes[0].id, // Optional class association
      },
    }),
    prisma.event.create({
      data: {
        title: "Science Fair",
        description: "Showcasing student projects in science.",
        startTime: new Date("2024-10-22T09:00:00Z"),
        endTime: new Date("2024-10-22T15:00:00Z"),
        classId: classes[1].id, // Optional class association
      },
    }),
    prisma.event.create({
      data: {
        title: "Graduation Ceremony",
        description: "Celebrating the achievements of our graduates.",
        startTime: new Date("2024-11-01T13:00:00Z"),
        endTime: new Date("2024-11-01T16:00:00Z"),
        classId: classes[2].id, // Optional class association
      },
    }),
  ]);

  // Step 13: Create Attendance Records
  const attendances = await Promise.all(
    students.map((student, index) => {
      return prisma.attendance.create({
        data: {
          date: new Date(`2024-09-${(index % 30) + 1}`),
          present: index % 2 === 0, // Half present, half absent
          studentId: student.ud,
          lessonId: lessons[index % lessons.length].id,
        },
      });
    })
  );

  // Step 14: Create Results Records
  const results = await Promise.all(
    students.map((student, index) => {
      return prisma.result.create({
        data: {
          score: Math.floor(Math.random() * 100), // Random score
          studentId: student.ud,
          examId: exams[index % exams.length].id,
        },
      });
    })
  );

  console.log("Database seeded successfully! Nishafanya updates");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

































































































