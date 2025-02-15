import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { LandingPage } from '../Pages/LandingPage'
import { NewsBlogPage } from '../Pages/NewsBlogPage'
import { SinglePostPage } from '../Pages/SinglePostPage'
import { AuthorPage } from '../Pages/AuthorPage'
import { Login } from '../Pages/Login'
import { Signup } from '../Pages/Signup'
import { Courses } from '../Pages/Courses'
import { AboutUs } from '../Pages/AboutUs'
import {Profile} from '../Pages/Profile';
import {Subscription} from '../Pages/Subscription';
import {Requests} from '../Pages/Requests';
import {MyPosts} from '../Pages/MyPosts';
import {CreatePost} from '../Pages/CreatePost'
import { PrivateRoute } from './PrivateRoute'


export const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/news-blogs' element={<NewsBlogPage/>}/>
        <Route path='/post/:id' element={<SinglePostPage/>}/>
        <Route path='/author/:id' element={<AuthorPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/aboutus' element={<AboutUs/>}/>
        <Route path='/courses' element={<Courses/>}/>

       
       <Route path="/dashboard/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
       
      
       <Route path="/dashboard/myposts" element={<PrivateRoute><MyPosts /></PrivateRoute>} />
      
       <Route path="/dashboard/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
      
      
       <Route path="/dashboard/requests" element={<PrivateRoute><Requests /></PrivateRoute>}/>
       
       
       <Route path="/dashboard/subscription"element={<PrivateRoute><Subscription /></PrivateRoute>} />
      
        

        {/* <Route path="*" element={<NotFound />} />  */}
    </Routes>
  )
}

export default AllRoutes