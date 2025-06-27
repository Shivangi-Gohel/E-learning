import { useCheckIfPurchasedQuery } from '@/features/api/purchaseApi';
import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

const PurchaseCourseProtectedRoute = ({children}) => {
    const {courseId} = useParams();
    const {data, isLoading} = useCheckIfPurchasedQuery(courseId);    

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-blue-500">Loading...</p>
            </div>
        )
    }

    return data?.isPurchased ? children : <Navigate to={`/course-detail/${courseId}`} />
}

export default PurchaseCourseProtectedRoute
