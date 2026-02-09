import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

 const TourTypeSchema = new Schema<ITourType>({
    name:{type:String, required:true}
 },{
    timestamps:true
})

export const TourType = model <ITourType>("TourType", TourTypeSchema)

const TourSchema = new Schema <ITour> ({
      title:{type:String, required:true},
      slug:{type:String, required:true, unique:true},
      descriptions:{type:String},
      images:{type:String, default:[]},
      location:{type:String},
      costFrom:{type:Number},
      startDate:{type:Date},
      endDate:{type:Date},
      included:{type:String, default:[]},
      excluded:{type:String, default:[]},
      amenities:{type:String, default:[]},
      tourPlan:{type:String, default:[]},
      maxGuest:{type:Number},
      minAge:{type:Number},
      division:{
        type:Schema.Types.ObjectId,
        ref:"Division",
        required:true
      },
      tourTypes:{
        type:Schema.Types.ObjectId,
        ref:"TourType",
        required:true
        
      }


},{timestamps:true})

export const Tour = model<ITour>("Tour", TourSchema)