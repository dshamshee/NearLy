import { getWorkerDetails } from "@/actions/getWorkerDetails";
import WorkerProfileEdit, { WorkerDetailsType } from "@/components/workerProfileEdit";



export default async function WorkerEditProfilePage(){

    const details = await getWorkerDetails();
    // console.log(details.data)
    if(!details.success || !details.data){
        return <div>Error: {details.message}</div>
    }

    // Type assertion needed because Mongoose populated document type doesn't match exactly
    return(
        <WorkerProfileEdit details={details.data as unknown as WorkerDetailsType}/>
    )
}