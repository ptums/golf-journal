import AppLayout from '@/components/Layouts/AppLayout'
import {Dialog, Transition} from '@headlessui/react'
import Head from 'next/head'
import {format} from 'date-fns'
import {useRouter} from 'next/router';
import {useState, Fragment, useEffect, useRef} from "react";
import {useCrud} from "@/hooks/crud";
import Swal from 'sweetalert2'
import {useAuth} from "@/hooks/auth";

const EIGHTEEN_HOLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const NINE_HOLES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Course = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [saveRound, setSaveRound] = useState(false);
    const [course, setCourse] = useState({});
    const [rounds, setRounds] = useState([]);
    const [score, setScore] = useState(0);
    const [currentRound, setCurrentRound] = useState({});
    const {update, create, singleCourse, singleRound} = useCrud({route: saveRound ? "rounds" : "course" , id: router?.query?.id});
    const { user } = useAuth();

    const handleCourseInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setCourse(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoundInput = (event, hole) => {
        const name = event.target.name;
        const value = event.target.value;

        setCurrentRound(prev => ({
            ...prev,
            hole,
            [name]: value
        }));
    }

    const addRound = async () => {
        const previousRounds = rounds.filter(round => round.hole !== currentRound.hole);

        setRounds([
            ...previousRounds,
            currentRound
        ]);

        setSaveRound(true);

    }


    const handleSave = async (e, data) => {
        e.preventDefault();

        if(Object.keys(data).includes('holes')) {
            if(data.holes !== 9 || data.holes !== 18) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Sorry, you must enter either 9 or 18 for number of holes.',
                    icon: 'error',
                    confirmButtonText: 'Close'
                });
                setCourse(prev => ({
                    ...Object.keys(prev).filter(p => !p.includes('holes'))
                }));
                setIsOpen(false);
            }
        }else {
            const req = await update({
                ...data,
                id: router?.query?.id
            });

            if (req.status === 200) {
                setIsOpen(false)
            }
        }
    }

    const saveRounds = async () => {
        const req = await create({
            rounds: JSON.stringify(rounds),
            courses_id: parseInt(router?.query?.id, 10),
            user_id: user?.id
        });
        getRounds();

        setSaveRound(false);
    }

    const getRounds = async () => {
        // singleRound
        const req = await singleRound({
            courses_id: parseInt(router?.query?.id, 10),
            user_id: user?.id
        });

        if(req.status === 200) {
            setRounds(JSON.parse(req?.data?.data?.rounds));
            setScore(req?.data?.data?.score);
        }
    }


    useEffect(() => {
        if(saveRound) {
            saveRounds();
        }
    }, [saveRound]);

    useEffect(() => {
        if(rounds.length <= 0 && user?.id) {
            getRounds()
        }
    }, [rounds, user]);

    return (
        <>
            <AppLayout
                header={
                    <div className="flex flex-row items-center">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight mr-3">
                            {singleCourse?.data?.name || "Course"}
                        </h2>
                        {singleCourse?.data?.played_at && (
                            <p className="text-sm">
                                <strong className="text-gray-400 mr-2">Last played:</strong>
                                <span>
                                {format(new Date(singleCourse?.data?.played_at), 'LLLL dd, yyyy')}
                            </span>
                            </p>
                        )}

                    </div>
                }>

                <Head>
                    <title>Golf Journal - Course</title>
                </Head>

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center sm:mb-6">
                            <strong className="text-2xl">Rounds</strong>
                            <button
                                className="rounded-full shadow-xl text-base bg-white m-3 px-3 py-4 font-bold"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                Edit
                            </button>
                        </div>
                        {singleCourse?.data?.holes === 18 && (
                            <div>
                                {EIGHTEEN_HOLES.map((hole, index) => (
                                    <div key={hole}
                                          className="bg-white shadow-sm sm:rounded-lg mb-5 hover:cursor-pointer hover:shadow w-full mx-auto p-6 border-b border-gray-200">
                                        <div
                                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:h-4">
                                            <div className="flex flex-row flex-wrap sm:items-center">
                                                <span
                                                    className="bg-green-500 text-white rounded-full flex flex-col justify-center text-center w-8 h-8 mb-3 sm:mb-0 mr-3">
                                                    {hole}
                                                </span>
                                                <span>
                                                    <input
                                                        type="number"
                                                        name="par"
                                                        onChange={(e) => handleRoundInput(e, hole)}
                                                        className="rounded border border-green-500 mr-3"
                                                        defaultValue={rounds[index]?.par}
                                                        placeholder="Par"
                                                    />
                                                  <input
                                                      type="number"
                                                      name="yards"
                                                      onChange={(e) => handleRoundInput(e, hole)}
                                                      className="rounded border border-green-500 mr-3"
                                                      defaultValue={rounds[index]?.yards}
                                                      placeholder="Yards"
                                                  />
                                                    <input
                                                        type="number"
                                                        name="score"
                                                        onChange={(e) => handleRoundInput(e, hole)}
                                                        className="rounded border border-green-500"
                                                        defaultValue={rounds[index]?.score}
                                                        placeholder="Score"
                                                    />
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) => addRound()}
                                                className="p-3 text-sm bg-green-700 rounded-3xl text-white hover:bg-green-500 disabled:bg-green-300 flex-row mt-4 sm:mt-0 sm:flex sm:justify-end"
                                                disabled={Object.keys(currentRound).includes('hole') && currentRound.hole === hole ? false : true}
                                            >
                                                <strong className="mr-1">+</strong>
                                                <span>Add</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {singleCourse?.data?.holes === 9 && (
                            <div>
                                {NINE_HOLES.map((hole, index) => (
                                    <div key={hole}
                                          className="bg-white shadow-sm sm:rounded-lg mb-5 hover:cursor-pointer hover:shadow w-full mx-auto p-6 border-b border-gray-200">
                                        <div
                                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:h-4">
                                            <div className="flex flex-row flex-wrap sm:items-center">
                                                <span
                                                    className="bg-green-500 text-white rounded-full flex flex-col justify-center text-center w-8 h-8 mb-3 sm:mb-0 mr-3">
                                                    {hole}
                                                </span>
                                                <span>
                                                    <input
                                                        type="number"
                                                        name="par"
                                                        onChange={(e) => handleRoundInput(e, hole)}
                                                        className="rounded border border-green-500 mr-3"
                                                        defaultValue={rounds[index]?.par}
                                                        placeholder="Par"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="yards"
                                                        onChange={(e) => handleRoundInput(e, hole)}
                                                        className="rounded border border-green-500 mr-3"
                                                        defaultValue={rounds[index]?.yards}
                                                        placeholder="Yards"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="score"
                                                        onChange={(e) => handleRoundInput(e, hole)}
                                                        className="rounded border border-green-500"
                                                        defaultValue={rounds[index]?.score}
                                                        placeholder="Score"
                                                    />
                                                </span>
                                            </div>
                                            <button
                                                    onClick={(e) => addRound()}
                                                    className="p-3 text-sm bg-green-700 rounded-3xl text-white hover:bg-green-500 disabled:bg-green-300 flex-row mt-4 sm:mt-0 sm:flex sm:justify-end"
                                                    disabled={Object.keys(currentRound).includes('hole') && currentRound.hole === hole ? false : true}
                                            >
                                                <strong className="mr-1">+</strong>
                                                <span>Add</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div
                             className="bg-white shadow-sm sm:rounded-lg mb-5 hover:cursor-pointer hover:shadow w-full mx-auto p-6 border-b border-gray-200">
                            <div
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:h-4">
                                <div className="flex flex-row flex-wrap sm:items-center">
                                    <strong className="mr-3">Final Score: </strong>
                                    {score}
                                </div>
                            </div>
                        </div>
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
                                        Edit course
                                    </Dialog.Title>
                                    <input type="text" onChange={(e) => handleCourseInput(e)} name="name"
                                           className="p-2 my-4 w-3/4 rounded block" placeholder="Course name"/>
                                    <input type="number" onChange={(e) => handleCourseInput(e)} name="holes"
                                           className="p-2 my-4 w-1/2 rounded block" placeholder="Holes"/>
                                    <input type="date" onChange={(e) => handleCourseInput(e)} name="played_at"
                                           className="p-2 my-4 w-1/2 rounded block" placeholder="Played at"/>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={(e) => handleSave(e, course)}
                                        >
                                            Update
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

export default Course
