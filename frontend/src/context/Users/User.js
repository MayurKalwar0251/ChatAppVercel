import axios from "axios";
import { server } from "../../utils/server";

export const getUserDetails = async (
  setIsAuthen,
  setUser,
  setLoading,
  setError
) => {
  try {
    setLoading(true);
    const response = await axios.get(`${server}/user/`, {
      withCredentials: true,
    });
    if (response.data.user) {
      setIsAuthen(true);
      setUser(response.data.user);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    console.log(error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
