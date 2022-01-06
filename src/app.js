const express = require('express');
const app = new express();
const { SERVER_PORT } = require('./config/config');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = require('graphql')
const user_data = require("../MOCK_DATA.json");

const userType = new GraphQLObjectType({ // defining the fields that are available in database table
    name: "User",
    fields: () => {
        return {
            id: { type: GraphQLInt },
            first_name: { type: GraphQLString },
            last_name: { type: GraphQLString },
            email: { type: GraphQLString },
            gender: { type: GraphQLString },
            ip_address: { type: GraphQLString }
        }
    }
})

const allQuery = new GraphQLObjectType({
    name: "allQuery", // it can be anything
    fields: {
        getAllUser: {
            type: new GraphQLList(userType),
            resolve(parent, args) {
                return user_data; // will use db query in practical scenerio
            }
        },
        getUserById: {
            type: userType,
            args: { id: { type: GraphQLInt}},
            resolve(parent, args) {
                for(let user of user_data){
                    if(args.id === user.id) // will use db query in practical scenerio
                    return user;
                }
                return null;
            }
        }
    }
})

const allMutation = new GraphQLObjectType({
    name: "allMutation",
    fields: {
        createUser: {
            type: userType,
            args: {
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                email: { type: GraphQLString },
                gender: { type: GraphQLString },
                ip_address: { type: GraphQLString }
            },
            resolve(parent, args) {
                const { first_name, last_name, email, gender, ip_address } = args;
                const id = parseInt(user_data.length) + 1;
                user_data.push({ id, first_name, last_name, email, gender, ip_address });
            }
        }
    }
})

const schema = new GraphQLSchema({ query: allQuery, mutation: allMutation });

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true  
}))




app.listen(SERVER_PORT, () => {
    console.log(`Server is up on port ${SERVER_PORT}`);
})