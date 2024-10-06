


"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { createParent, updateParent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type ParentSchema = {
  ud?: any;
  username: string;
  name: string;
  surname: string;
  email?: string;
  phone: string;
  address: string;
  password: string;
  students: string[]; // To store student IDs
};

type Student = {
  name: string;
  ud: string;
};

const ParentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [myStudents, setMyStudents] = useState<Student[]>([]); // Filtered students based on search
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]); // Selected students
  const [formData, setFormData] = useState<ParentSchema>({
    ud: data?.ud || "",
    password: data?.password || "",
    username: data?.username || "",
    name: data?.name || "",
    surname: data?.surname || "",
    email: data?.email || "",
    phone: data?.phone || "",
    address: data?.address || "",
    students: [], // Will hold student IDs
  });
  const [message, setMessage] = useState<string>(''); 
  const [error, setError] = useState<boolean>(false);

  const filterStudents = (term: string) => {
    const allstudents = relatedData?.students || []; // Access the students array
    const searchRegex = new RegExp(term.replace(/\s+/g, ""), "i");

    const parentStudent = allstudents.filter((student: Student) =>
      searchRegex.test(student.name.replace(/\s+/g, ""))
    );
    setMyStudents(parentStudent); // Set the filtered students
  };

  const handleAddStudent = (student: Student) => {
    // Prevent duplicate students from being added
    if (!assignedStudents.some((s) => s.ud === student.ud)) {
      setAssignedStudents([...assignedStudents, student]);
      setFormData({
        ...formData,
        students: [...formData.students, student.ud], // Add student ID to formData
      });
    }
  };

  const handleRemoveStudent = (student: Student) => {
    const updatedAssigned = assignedStudents.filter(
      (s) => s.ud !== student.ud
    );
    setAssignedStudents(updatedAssigned);
    setFormData({
      ...formData,
      students: formData.students.filter((id) => id !== student.ud), // Remove student ID from formData
    });
  };
  const router = useRouter();

    // submiting the form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    
      const result = await (type === "create" ? createParent(formData) : updateParent(formData));
    
      if (result.success) {
        setMessage('Parent created successfully!');
        toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
        setError(false);
        setOpen(false);
        router.refresh();
      } else {
        // Join multiple error messages into a single string
        const errorMessage = result.messages.join(' , ');
        setMessage(errorMessage || 'Error creating parent. Please try again.');
        setError(true);
      }
    };
    

  return (
    <div className="p-5">
      <h1 className="text-xl mx-auto text-center mb-2 font-semibold">
        {type === "create" ? "Create a new parent" : "Update the parent"}
      </h1>
      <form className="mt-2" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="w-1/2">
            <input
              className="p-2 w-full bg-slate-200 rounded-md"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              type="text"
              placeholder="Enter username"
            />
            <input
              className="p-2 w-full mt-4 bg-slate-200 rounded-md"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="email"
              placeholder="Enter email"
            />
            <input
              className="p-2 w-full mt-4 bg-slate-200 rounded-md"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
              type="text"
              placeholder="Enter address"
            />
              <input
              className="p-2 w-full mt-4 bg-slate-200 rounded-md"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type="text"
              placeholder="Enter Password"
            />
              <input
              className="p-2 w-full mt-4 bg-slate-200 rounded-md hidden"
              value={data?.ud}
              onChange={(e) =>
                setFormData({ ...formData, ud: e.target.value })
              }
              type="text"
              placeholder={data?.ud}
            />
          </div>

          <div className="w-1/2">
            <input
              className="p-2 w-full bg-slate-200 rounded-md"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              type="text"
              placeholder="Enter Firstname"
            />
            <input
              className="p-2 w-full mt-4 bg-slate-200 rounded-md"
              value={formData.surname}
              onChange={(e) =>
                setFormData({ ...formData, surname: e.target.value })
              }
              required
              type="text"
              placeholder="Enter Surname"
            />
            <input
              className="p-2 w-full mt-4 bg-slate-200 rounded-md"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              type="number"
              placeholder="Enter Phone Number"
            />
          
                        {message && (
                <div style={{ color: error ? 'red' : 'green' }}>
                  {message}
                </div>
              )}


          </div>
        </div>

        <h1 className="mt-4 ml-2">Students</h1>
        <div className="flex mt-2 items-center justify-between gap-2 text-md rounded-full ring-[1.5px] ring-gray-300 px-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search student name..."
              className="w-[300px] p-2 bg-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => filterStudents(searchTerm)}
            className="bg-green-300 hover:bg-green-400 p-1 my-[4px] w-[100px] ml-4 rounded-full"
          >
            Search
          </button>
        </div>

        {/* Render students as checkboxes based on search results */}
        <div className="w-full flex gap-4">
          <div className="flex flex-col mt-4 w-1/2">
            {myStudents.length > 0 ? (
              myStudents.map((student: Student, index) => (
                <div key={index} className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1 px-3 text-sm mt-1 mb-1 bg-blue-500 text-white rounded"
                    onClick={() => handleAddStudent(student)}
                  >
                    Add
                  </button>
                  <label className="text-[16px]">{student.name}</label>
                </div>
              ))
            ) : (
              <p>No students found</p>
            )}
          </div>

          {/* Show and confirm the selected students */}
          <div className="w-1/2 flex-wrap flex flex-col bg-lamaSky mt-4 rounded-lg p-2 ">
            <h1 className="font-semibold ml-2">Assigned Students:</h1>
            {assignedStudents.length > 0 && (
              <ol className="pl-4 list-decimal list-inside">
                {assignedStudents.map((student, index) => (
                  <li key={index} className="even:bg-slate-200">
                    <button
                      type="button"
                      className="p-1 px-3 text-sm mt-1 mb-1 bg-red-500 text-white rounded"
                      onClick={() => handleRemoveStudent(student)}
                    >
                      Remove
                    </button>
                    <span className="ml-2">{student.name}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="p-2 px-6 w-full rounded-lg bg-blue-700 hover:bg-blue-800 text-white"
            type="submit"
          >
            {type === "create" ? "Create Parent" : "Update Parent"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParentForm;

