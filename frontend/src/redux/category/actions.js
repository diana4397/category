import {
   FETCH_Category,
   FETCH_Category_ERROR,
   FETCH_Category_SUCCESS,
   ADD_UPDATE_Category_ERROR,
   ADD_UPDATE_Category,
   ADD_UPDATE_Category_SUCCESS
 } from '../actions';
 
 export const categorylist = category => ({
     type: FETCH_Category,
     payload: { category },
 });
 
 export const categorylistSuccess = category => ({
     type: FETCH_Category_SUCCESS,
     payload: category,
 });

 export const categorylistError = categorylist => ({
    type: FETCH_Category_ERROR,
    payload: categorylist,
});
 
 export const addUpdatecategory = (category, history) => ({
     type: ADD_UPDATE_Category,
     payload: { category, history },
 });
 
 export const addUpdatecategorySuccess = category => ({
     type: ADD_UPDATE_Category_SUCCESS,
     payload:category,
 });

 export const addUpdatecategoryError = category => ({
    type: ADD_UPDATE_Category_ERROR,
    payload:category,
});
 
 