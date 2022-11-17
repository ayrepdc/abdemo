import * as AWS from 'aws-sdk'
import { ConfigurationOptions } from 'aws-sdk'

const configuration: ConfigurationOptions = {
    region: process.env.REACT_APP_REGION,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    accessKeyId: process.env.REACT_APP_ACCESS_ID
}

AWS.config.update(configuration)

export const docClient = new AWS.DynamoDB.DocumentClient()

export const fetchData = (tableName) => {
    var params = {
        TableName:tableName
    }

    docClient.scan(params, function (err, data) {
        if (!err) {
           return data
        }
        else{
            console.log("error ", err)
        }
    })
}