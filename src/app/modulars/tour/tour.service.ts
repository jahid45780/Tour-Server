import AppError from "../../errorHerplrs/appError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";


                  // tour work code

const createTour = async(payload:ITour)=>{

   const existingTour = await Tour.findOne({title:payload.title});

   if(existingTour){
    throw new AppError(409,"A tour with this title already exists.")
   }

    const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    let slug = `${baseSlug}`

    let counter = 0;
    while (await Tour.exists({ slug })) {
        slug = `${slug}-${counter++}` 
    }

    payload.slug = slug;
 
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

    // const meta = await queryBuilder.getMeta()

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])


    return {
        data,
        meta
    }
};


const updateTour = async (id: string, payload: Partial<ITour>) => {

    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    // if (payload.title) {
    //     const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    //     let slug = `${baseSlug}`

    //     let counter = 0;
    //     while (await Tour.exists({ slug })) {
    //         slug = `${slug}-${counter++}` // dhaka-division-2
    //     }

    //     payload.slug = slug
    // }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

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

const getAllTourTypes = async()=>{
    return await TourType.find()
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




