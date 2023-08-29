import response from "../lib/response-lib";
/***********************************************************************************************************************
 * Security Requirements:
 * None - this is wide open
 ***********************************************************************************************************************/

export async function main(event, context) {
    console.log("armpit", event);
    console.log(event.pathParameters);
    try {
        return response.success("armpit");
    } catch (exception) {
        return response.failure();
    } finally {
    }
}
