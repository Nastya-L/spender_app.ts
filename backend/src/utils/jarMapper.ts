import type mongoose from 'mongoose';
import type { IJar } from '../models/JarSchema';

interface IJarToFE {
  _id: mongoose.Types.ObjectId
  name: string
  color: string
  users: [mongoose.Types.ObjectId]
  created: Date
  owner: mongoose.Types.ObjectId
}

const jarMapper = (jar: IJar): IJarToFE => {
  return {
    _id: jar._id,
    name: jar.name,
    color: jar.color,
    users: jar.users,
    created: jar.created,
    owner: jar.owner
  };
};

export default jarMapper;
