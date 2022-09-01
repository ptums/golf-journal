import axios from '@/lib/axios'
import useSWR, { useSWRConfig } from "swr";


export const useCrud = ({ route, id = null } = {}) => {
    const { mutate } = useSWRConfig()

    const create = async ({  ...props }) => {
        return axios
            .post(`/create/${route}`, props)
            .then(res => res)
            .then(() => mutate(`/read/${route}`))
            .catch(error => {
                if (error?.response?.status !== 422) throw error
            })
    }

    const update = async ({  ...props }) => {
        return axios
            .put(`/update/${route}`, props)
            .then(res => res)
            .then(() => mutate(`/read/${route}/${props.id}`))
            .catch(error => {
                if (error?.response?.status !== 422) throw error
            })
    }

    const remove = async ({...props}) => {
        return axios
            .delete(`/delete/${route}/${props.id}`)
            .then(res => res)
            .then(() => mutate(`/read/${route}`))
            .catch(error => {
                if (error?.response?.status !== 422) throw error
            })
    }

    const { data:courses } = useSWR(`/read/course`, () =>
        axios
            .get(`/read/${route}`)
            .then(res => res?.data)
            .catch(error => {
                if (error?.response?.status !== 409) throw error
            }),
    );

    const { data: singleCourse } = useSWR(`/read/course/${id}`, () =>
        axios
            .get(`/read/${route}/${id}`)
            .then(res => res?.data)
            .catch(error => {
                if (error?.response?.status !== 409) throw error

            }),
    );

    const singleRound = async ({  ...props }) => {
        return axios
            .post(`/read/rounds`, props)
            .then(res => res)
            .catch(error => {
                return new Error(error);
            })
    }

    return {
        create,
        courses,
        singleCourse,
        singleRound,
        remove,
        update
    }
}
