

"use client";
import React, { Dispatch, SetStateAction, useState } from 'react';
import { CldUploadWidget } from "next-cloudinary";
import Image from 'next/image';


type ParentSchema = {
  username: String;
  name: String;
  surname: String;
  email?: String;
  phone: String;
  address: String;
};
type Student = {
  name: string;
  ud: string;
  // Add other properties if necessary
}



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
  const [img, setImg] = useState<any>();
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [myStudents, setMystudents] = useState([]); // State for search input
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]); 
  const allstudents = relatedData
  
  const handleCheckboxChange = (student: Student, isChecked: boolean) => {
    if (isChecked) {
      // Add student to assignedStudents if checked
      setAssignedStudents([...assignedStudents, student]);
    } else {
      // Remove student from assignedStudents if unchecked
      setAssignedStudents(assignedStudents.filter(s => s.ud !== student.ud));
    }
  };

  const filterStudents = (term: string) => {
    const allstudents = relatedData?.students || []; // Access the students array
  
    // Create a regex from the term that is case-insensitive and ignores spaces
    const searchRegex = new RegExp(term.replace(/\s+/g, ''), 'i');
  
    const parentStudent = allstudents.filter((student:any) =>
      searchRegex.test(student.name.replace(/\s+/g, '')) // Remove spaces from student names before testing
    );
  
    setMystudents(parentStudent); // Set the filtered students
   
  };
  
  
  
  

  return (
    <div className='p-5'>
      <h1 className="text-xl mx-auto text-center mb-2 font-semibold">
        {type === "create" ? "Create a new parent" : "Update the parent"}
      </h1>
      <form className='mt-2'>
        <div className='flex gap-4'>
          <div className='w-1/2'>
            <input
              className='p-2 w-full bg-slate-200 rounded-md'
              defaultValue={data?.username}
              name='username'
              required
              type='text'
              placeholder='Enter username'
            />
            <input
              className='p-2 w-full mt-4 bg-slate-200 rounded-md'
              defaultValue={data?.email}
              name='email'
              type='email'
              placeholder='Enter email'
            />
            <input
              className='p-2 w-full mt-4 bg-slate-200 rounded-md'
              defaultValue={data?.address}
              name='address'
              required
              type='text'
              placeholder='Enter address'
            />
          </div>

          <div className='w-1/2'>
            <input
              className='p-2 w-full bg-slate-200 rounded-md'
              defaultValue={data?.username}
              name='name'
              required
              type='text'
              placeholder='Enter Firstname'
            />
            <input
              className='p-2 w-full mt-4 bg-slate-200 rounded-md'
              defaultValue={data?.username}
              name='surname'
              required
              type='text'
              placeholder='Enter Surname'
            />
            <input
              className='p-2 w-full mt-4 bg-slate-200 rounded-md'
              defaultValue={data?.phone}
              name='phone'
              type='number'
              placeholder='Enter Phone Number'
            />
          </div>
        </div>

        <h1 className='mt-4 ml-2'>Students</h1>
        <div className="flex mt-2 items-center justify-between gap-2 text-md rounded-full ring-[1.5px] ring-gray-300 px-2">
          <div className="flex items-center gap-2">
            <Image className='ml-2' src="/search.png" alt="" width={14} height={14} />
            <input
              type="text"
              placeholder="Search student name..."
              className="w-[200px] p-2 bg-transparent outline-none"
              value={searchTerm} // Bind the search input to the state
              onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
            />
          </div>
          <button type="button" onClick={()=>filterStudents(searchTerm)} className="bg-green-300 hover:bg-green-400 p-2 my-1 w-[100px] ml-4 rounded-full">Search</button>
        </div>
 
        {/* Render students as checkboxes based on search results */}
        <div className='w-full flex gap-4'>
           <div className='flex flex-col mt-4 w-1/2'>
          {myStudents.length > 0 ? (
            myStudents.map((student:Student, index) => (
              <div key={index} className='flex items-center gap-2'>
                <input
                   onChange={(e) => handleCheckboxChange(student, e.target.checked)}
                  name='student'
                  value={student.ud}
                  id={student.ud}
                  className='h-[16px] w-[16px]'
                  type="checkbox" />
                <label className='text-[16px]' htmlFor={student.ud}>{student.name}</label>
              </div>
            ))
          ) : (
            <p></p>
          )}
          </div>
          
                      <div className='w-1/2 flex-wrap flex flex-col bg-lamaSky mt-4 rounded-lg p-2 '>
              <h1 className='font-semibold ml-2'>Selected Students:</h1>
              {assignedStudents && (
                <ol className="pl-4 list-decimal list-inside">  {/* 'list-inside' ensures numbers stay inside */}
                  {assignedStudents.map((student, index) => (
                    <li key={index} className='even:bg-slate-200'>
                      {student.name}
                    </li>
                  ))}
                </ol>   
              )}
            </div>

        </div>
       

        <div className='mt-4'>
          <CldUploadWidget
            uploadPreset="vertex"
            onSuccess={(result, { widget }) => {
              setImg(result.info);
              // widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div
                  className="text-md mt-4 text-center text-gray-900 flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <button
                    type='button'
                    className='p-2 px-4 flex gap-2 hover:bg-yellow-400 rounded-md mx-auto bg-lamaYellow w-fit'>
                    <Image src="/upload.png" alt="" width={28} height={28} />
                    <span className="mt-[1px]">Upload Image</span>
                  </button>
                </div>
              );
            }}
          </CldUploadWidget>
        </div>

        <button
          className='p-2 mt-2 px-9 w-full flex gap-2 text-center hover:bg-blue-800 rounded-md mx-auto bg-blue-600'>
          <span className="mt-[1px] text-center mx-auto text-white font-semibold">Submit</span>
        </button>
      </form>
    </div>
  );
};

export default ParentForm;






