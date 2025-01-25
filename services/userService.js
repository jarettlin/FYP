import { supabase } from "../lib/supabase";

export const getUserData = async (userID) =>{
    try{
        const {data, error} = await supabase
        .from('users')
        .select()
        .eq('id', userID)
        .single();

        if(error){
            return{success: false, msg: error?.message};
        }
    }catch(error){
        console.log('got error: ', error);
        return {success: false, msg:error.message};
    }







}