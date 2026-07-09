import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHerplrs/appError";
import { QueryBuilder } from "../../utils/QueryBuilder";
// import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";


                  // tour work code

const createTour = async(payload:ITour)=>{

   const existingTour = await Tour.findOne({title:payload.title});

   if(existingTour){
    throw new AppError(409,"A tour with this title already exists.")
   }
 
    const tour = await Tour.create(payload)

    return tour
}

const getAllTours = async(query: Record<string, string>)=>{
     const queryBuilder = new QueryBuilder(Tour.find(), query)

    const tours = await queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])


    return {
        data,
        meta
    }
};

// const getAllTours = async(query: Record<string, string>)=>{
//     const filter = query
//     const searchTerm = query.searchTerm || "" ;
//     const sort = query.sort || "-createdAt";
//     const page = Number(query.page) || 1;
//     const limit = Number(query.limit) || 1;

//     const skip = (page -1) * limit

//     const fields = query.fields?.split(",").join(" ") || ""; 

//     for(const field of excludeField){
//         // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//         delete filter[field]
//     }
    
//     const searchQuery = {
//         $or:tourSearchableFields.map(filed=>({[filed]:{$regex:searchTerm, $options:"i"}}))
//     }

//     const tour  = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit);
//     const totalTours = await Tour.countDocuments()

//     const totalPage = Math.ceil(totalTours / limit)

//    const meta ={
//       page:page,
//       limit:limit,
//       total:totalTours,
//       totalPage:totalPage
//    }

//     return{
//         data:tour,
//         meta:{
//             total:meta
//         }
//     }
// }

const updateTour = async (id: string, payload: Partial<ITour>) => {

    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    if(payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length >0){
        payload.images =[...payload.images, ...existingTour.images]
    }

    if(payload.deleteImages && payload.deleteImages.length >0 && existingTour.images && existingTour.images.length >0){
        const restDBImages = existingTour.images?.filter(imageUrl => !payload.deleteImages?.includes(imageUrl)) 

        const  updatedPayloadImages =(payload.images || [])
        .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
        .filter(imageUrl => !restDBImages.includes(imageUrl))
        
        payload.images = [...restDBImages, ...updatedPayloadImages]
        
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

    if(payload.deleteImages && payload.deleteImages.length >0 && existingTour.images && existingTour.images.length >0){
         await Promise.all(payload.deleteImages.map(url => deleteImageFromCLoudinary(url)))
    }

    return updatedTour;
};

const deleteTour = async(id:string)=>{
    await Tour.findByIdAndDelete(id)
}


// tour type work code

const createTourType = async (payload: ITourType) => {
    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }
    const result = await TourType.create(payload); 
  return result;
};

const getAllTourTypes = async(
      // eslint-disable-next-line @typescript-eslint/no-inferrable-types
      page: number = 1,
      // eslint-disable-next-line @typescript-eslint/no-inferrable-types
      limit: number = 10
)=>{
    const skip = (page - 1) * limit;
    return await TourType.find().skip(skip).limit(limit);
}

const updateTourType = async (id:string, payload:ITourType)=>{
    const existingTourType = await TourType.findById(id);
    if(!existingTourType){
        throw new AppError(409, "Tour type not found");
    }

    const updatedTourTypes = await TourType.findByIdAndUpdate(id, payload,{new:true})
   return updatedTourTypes
   
}

const deleteTourType = async (id:string)=>{
    const existingTourType = await TourType.findById(id)
    if(!existingTourType){
        throw new AppError(409, "Tour type not found");
    }

     return await TourType.findByIdAndDelete(id) 
}








export const TourService = {
    createTour,
    getAllTours,
    updateTour,
    deleteTour,
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType
}




