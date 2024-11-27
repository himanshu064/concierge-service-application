import { failed, success } from "@/api/lib/response";
import db from "@/api/db/connect";
export const register = async (data) => {
  let { email, password } = data;
  try {
    const {data} = await db.auth.signUp({
      email,
      password,

    })
    console.log({data});
    
    return success({
      data: data,
    });

  } catch (error) {
    return failed({
      data: {},
      message: error.message
    });

  }
};

export const login = async (data) => {
  let { email, password } = data;
  try {
    const data = await db.auth.signInWithPassword({
      email,
      password
    })
    console.log({data});

    return success({
      data: data,
    });

  } catch (error) {
    return failed({
      data: {},
      message: error.message
    });

  } 
}

