import AppLayout from '@/components/Layouts/AppLayout'
import {Dialog, Transition} from '@headlessui/react'
import Head from 'next/head'
import Link from 'next/link'
import {useState, Fragment, useEffect} from "react";
import {useCrud} from "@/hooks/crud";
import {format} from "date-fns";
import Swal from "sweetalert2";

const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [course, setCourse] = useState({});
    const {create, courses, remove } = useCrud({route: "course"});

    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setCourse(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if(Object.keys(course).includes('holes')) {
            const holeToNum = parseInt(course.holes, 10);

            if(holeToNum === 9 || holeToNum === 18) {
                const req = await create({...course});

                if (req.status === 200) {
                    setIsOpen(false)
                }

                return;
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Sorry, you must enter either 9 or 18 for number of holes.',
                    icon: 'error',
                    confirmButtonText: 'Close'
                });

                setCourse({});
                setIsOpen(false);
                return;
            }
        }

        Swal.fire({
            title: 'Error!',
            text: 'Both a course name and number of holes is required.',
            icon: 'error',
            confirmButtonText: 'Close'
        });
    }

    const duplicate = async (c) => {
        const req = await create({...c});

        if (req.status === 200) {
            setIsOpen(false)
        }
    }

    const handleDelete = async (id) => {
       await remove({id})
    }

    return (
        <>
            <AppLayout
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Game History
                    </h2>
                }>

                <Head>
                    <title>Golf Journal - Game History</title>
                </Head>

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="flex justify-end sm: mb-6">
                            <button
                                className="rounded-full shadow-xl text-xl bg-white m-3 px-2 font-bold"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                +
                            </button>
                        </div>
                        {courses?.data && courses?.data.sort((a, b) => a.played_at < b.played_at ? 1 : -1).map(c => (
                            <div key={`${c.name}-${c.played_at}`} className="block bg-white overflow-hidden shadow-sm sm:rounded-lg mb-5 hover:cursor-pointer hover:shadow">
                                <div className="p-6 bg-white border-b border-gray-200 flex justify-between h-20 align-middle">
                                    <Link href={`course/${c?.id}`}>
                                        <a>
                                            <span className="mr-4"><strong>Course:</strong> {c?.name}</span>
                                            <span className="mr-4"><strong>Holes:</strong> {c?.holes}</span>
                                            <span className={c?.score ? "mr-4" : "mr-0"}><strong>Last Played:</strong> {format(new Date(c?.played_at), 'LLLL dd, yyyy')}</span>
                                            {c?.score && <span><strong>Score:</strong> {c?.score}</span>}
                                        </a>
                                    </Link>
                                   <div className="flex flex-row justify-between w-">
                                       <button onClick={() => handleDelete(c.id)} className="px-2 pt-1 mr-4 text-sm bg-red-700 rounded-3xl text-white hover:bg-red-500 flex flex-row sm:flex sm:justify-end">
                                           <span>Delete</span>
                                       </button>
                                       <button onClick={() => duplicate(c)} className="px-2 pt-1 text-sm bg-green-700 rounded-3xl text-white hover:bg-green-500 flex flex-row sm:flex sm:justify-end">
                                           <span>Play again</span>
                                       </button>
                                   </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AppLayout>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25"/>
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Add a new course
                                    </Dialog.Title>
                                    <input type="text" onChange={handleInput} name="name"
                                           className="p-2 my-4 w-3/4 rounded block" placeholder="Course name"/>
                                    <input type="number" onChange={handleInput} name="holes"
                                           className="p-2 my-4 w-1/2 rounded block" placeholder="Holes"/>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => handleSave()}
                                        >
                                            Add course
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default Dashboard
