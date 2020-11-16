import React from 'react'
import CourseHistory from '../components/CourseHistory'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/fonts.css'
import './CourseHistory.css'
export default { title: 'Course History' }

const Props = {
  user: 'mmichigan@gmail.com',
}

export const Table = () => <CourseHistory {...Props} />
