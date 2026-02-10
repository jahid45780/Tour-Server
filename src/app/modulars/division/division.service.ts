import AppError from "../../errorHerplrs/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";


 const createDivision = async (payload:IDivision)=>{
     
    const existingDivision = await Division.findOne({name:payload.name})

    if(existingDivision){
        throw new AppError( 200, "A division with this name already exist")
    }


    const division = await Division.create(payload)
    return division

 }

 export const DivisionService = {
       createDivision
 }