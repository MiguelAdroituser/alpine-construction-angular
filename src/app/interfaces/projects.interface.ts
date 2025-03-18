export interface Project {
    customerId: string; //Required
    userId: string; //Required
    projectName: string;
    registrationDate: Date;
    _id?:string;
}


/* 
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Project.name, required: true })
    customerId: mongoose.Types.ObjectId;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    userId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    projectName: string;

    @Prop({ required: true })
    registrationDate: Date;
*/