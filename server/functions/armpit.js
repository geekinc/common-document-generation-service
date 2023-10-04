import response from "../lib/response-lib";
/***********************************************************************************************************************
 * Security Requirements:
 * None - this is wide open
 ***********************************************************************************************************************/

export async function main(event, context) {
    console.log("armpit", event);
    console.log(event.pathParameters);

    console.log(process.env.stage);
    let count = event.pathParameters.count;
    try {
        return response.success(count || "armpit");
    } catch (exception) {
        return response.failure();
    } finally {
    }
}
