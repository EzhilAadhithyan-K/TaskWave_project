import axios from "axios";

export const getCollaborators = async (taskId, token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/api/tasks/${taskId}/collaborators`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.collaborators;
};