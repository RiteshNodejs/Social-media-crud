import { mergeResolvers } from "@graphql-tools/merge";
import userResolvers from "./user_resolver";
const resolvers = mergeResolvers ([
    userResolvers,
   

])

export default resolvers