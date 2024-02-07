import { authenticate, verify } from "../../lib/keycloak-lib.js";
process.env.LOG_LEVEL = 'off';

test('keycloak-lib - authenticate a known user', async () => {

    let result = await authenticate('foo', '456');

    expect(result).toHaveProperty('status');
    expect(result.status).toBe('success');
    expect(result.data).toHaveProperty('access_token');
    expect(result.data).toHaveProperty('expires_in');
    expect(result.data).toHaveProperty('refresh_expires_in');
    expect(result.data).toHaveProperty('refresh_token');
    expect(result.data).toHaveProperty('token_type');
    expect(result.data).toHaveProperty('not-before-policy');
    expect(result.data).toHaveProperty('session_state');
    expect(result.data).toHaveProperty('scope');
    expect(result.data).toHaveProperty('id_token');
});


test('keycloak-lib - authenticate an unknown user', async () => {

    let result = await authenticate('foobar', '456');

    expect(result).toHaveProperty('status');
    expect(result.status).toBe('error');
    expect(result.data).toHaveProperty('error');
    expect(result.data.error).toBe('invalid_grant');
    expect(result.data).toHaveProperty('error_description');
    expect(result.data.error_description).toBe('Invalid user credentials');
});


test('keycloak-lib - authenticate a known user with a bad password', async () => {

    let result = await authenticate('foo', 'WRONG_PASSWORD');

    expect(result).toHaveProperty('status');
    expect(result.status).toBe('error');
    expect(result.data).toHaveProperty('error');
    expect(result.data.error).toBe('invalid_grant');
    expect(result.data).toHaveProperty('error_description');
    expect(result.data.error_description).toBe('Invalid user credentials');
});


test('keycloak-lib - bad data passed in', async () => {

    let result = await authenticate({BAD_DATA: 'foo'}, 'WRONG_PASSWORD');

    expect(result).toHaveProperty('status');
    expect(result.status).toBe('error');
    expect(result.data).toHaveProperty('error');
    expect(result.data.error).toBe('invalid_grant');
    expect(result.data).toHaveProperty('error_description');
    expect(result.data.error_description).toBe('Invalid user credentials');
});


test('keycloak-lib - NULL data passed in', async () => {

    let result = await authenticate(null, null);

    expect(result).toHaveProperty('status');
    expect(result.status).toBe('error');
    expect(result.data).toHaveProperty('error');
    expect(result.data.error).toBe('invalid_grant');
    expect(result.data).toHaveProperty('error_description');
    expect(result.data.error_description).toBe('Invalid user credentials');
});


test('keycloak-lib - verify known good token', async () => {
    let result = await authenticate('foo', '456');
    let token = result.data.access_token;

    result = await verify(token);

    expect(result).toHaveProperty('status');
    expect(result.status).toBe('success');
    expect(result.data).toHaveProperty('preferred_username');
    expect(result.data.preferred_username).toBe('foo');
});


test('keycloak-lib - verify known good (but expired) token', async () => {
    let token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJjLVlhMWdpbkNMcFdjUG4weU05bU1MNUlvS3FhWFBtc3RPNXBpeHdLZk5zIn0.eyJleHAiOjE3MDcwODU0OTQsImlhdCI6MTcwNzA4NTQzNCwianRpIjoiZTQ5OGU0ZTEtN2U1Mi00OGY1LWJhYzUtOTJhYTFmOWVlMGUwIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOlsibWFzdGVyLXJlYWxtIiwiYWNjb3VudCJdLCJzdWIiOiIwZDdjNDkwNy02NWY1LTRmZjktODU4Yi0yYTkyZDQ1NzFkZmQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJsb2NhbC1jbGllbnQiLCJzZXNzaW9uX3N0YXRlIjoiOWE0YjRmZGMtNjNkMC00NTkzLTg2MzktYTg1ZGMwZGExNGM5IiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA5MCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiY3JlYXRlLXJlYWxtIiwiZGVmYXVsdC1yb2xlcy1tYXN0ZXIiLCJhcHBfdXNlciIsIm9mZmxpbmVfYWNjZXNzIiwiYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiIsImFwcF9hZG1pbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im1hc3Rlci1yZWFsbSI6eyJyb2xlcyI6WyJ2aWV3LXJlYWxtIiwidmlldy1pZGVudGl0eS1wcm92aWRlcnMiLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiaW1wZXJzb25hdGlvbiIsImNyZWF0ZS1jbGllbnQiLCJtYW5hZ2UtdXNlcnMiLCJxdWVyeS1yZWFsbXMiLCJ2aWV3LWF1dGhvcml6YXRpb24iLCJxdWVyeS1jbGllbnRzIiwicXVlcnktdXNlcnMiLCJtYW5hZ2UtZXZlbnRzIiwibWFuYWdlLXJlYWxtIiwidmlldy1ldmVudHMiLCJ2aWV3LXVzZXJzIiwidmlldy1jbGllbnRzIiwibWFuYWdlLWF1dGhvcml6YXRpb24iLCJtYW5hZ2UtY2xpZW50cyIsInF1ZXJ5LWdyb3VwcyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsInNpZCI6IjlhNGI0ZmRjLTYzZDAtNDU5My04NjM5LWE4NWRjMGRhMTRjOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJmb28iLCJlbWFpbCI6ImZvb0BleGFtcGxlLmNvbSJ9.qjXGpVpL0IrR--zgW0Mwnjg_pnuNiWCUSmEC5pblkHUXDvFislOUKKhnA_XMuXQlLx7fUQPzXiyVVAF2C4nkKYJiEND_hy5elXWHn-IWkk59snYWHz4l_HV-LjzCe84XUlIASy1PKfpt2dpVq-55NvJ272MG9WTJikEZAlYlpiKuq32tbGsE6D5Urup8_6nzeNVafhjnHoU5zrOxeAYpUk_7gjNVr_BsyDgkc0HlwlBrTdwOhwaTL6JYu0dsclypAzqmShaD7FxtE-jRLrPv9nNSRDo5JW7df-NTQydE8PNWBxIxjOCOmDreYyos3BW-WbusjpS3QJEzbJn353D3wQ`;

    let result = await verify(token);

    expect(result).toHaveProperty('status');
    expect(result.status).toBe('error');
    expect(result.data).toBe('Invalid token');
});


test('keycloak-lib - verify invalid token', async () => {
    let token = `INVALID_DATAeyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJjLVlhMWdpbkNMcFdjUG4weU05bU1MNUlvS3FhWFBtc3RPNXBpeHdLZk5zIn0.eyJleHAiOjE3MDcwODU0OTQsImlhdCI6MTcwNzA4NTQzNCwianRpIjoiZTQ5OGU0ZTEtN2U1Mi00OGY1LWJhYzUtOTJhYTFmOWVlMGUwIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOlsibWFzdGVyLXJlYWxtIiwiYWNjb3VudCJdLCJzdWIiOiIwZDdjNDkwNy02NWY1LTRmZjktODU4Yi0yYTkyZDQ1NzFkZmQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJsb2NhbC1jbGllbnQiLCJzZXNzaW9uX3N0YXRlIjoiOWE0YjRmZGMtNjNkMC00NTkzLTg2MzktYTg1ZGMwZGExNGM5IiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA5MCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiY3JlYXRlLXJlYWxtIiwiZGVmYXVsdC1yb2xlcy1tYXN0ZXIiLCJhcHBfdXNlciIsIm9mZmxpbmVfYWNjZXNzIiwiYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiIsImFwcF9hZG1pbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im1hc3Rlci1yZWFsbSI6eyJyb2xlcyI6WyJ2aWV3LXJlYWxtIiwidmlldy1pZGVudGl0eS1wcm92aWRlcnMiLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiaW1wZXJzb25hdGlvbiIsImNyZWF0ZS1jbGllbnQiLCJtYW5hZ2UtdXNlcnMiLCJxdWVyeS1yZWFsbXMiLCJ2aWV3LWF1dGhvcml6YXRpb24iLCJxdWVyeS1jbGllbnRzIiwicXVlcnktdXNlcnMiLCJtYW5hZ2UtZXZlbnRzIiwibWFuYWdlLXJlYWxtIiwidmlldy1ldmVudHMiLCJ2aWV3LXVzZXJzIiwidmlldy1jbGllbnRzIiwibWFuYWdlLWF1dGhvcml6YXRpb24iLCJtYW5hZ2UtY2xpZW50cyIsInF1ZXJ5LWdyb3VwcyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsInNpZCI6IjlhNGI0ZmRjLTYzZDAtNDU5My04NjM5LWE4NWRjMGRhMTRjOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJmb28iLCJlbWFpbCI6ImZvb0BleGFtcGxlLmNvbSJ9.qjXGpVpL0IrR--zgW0Mwnjg_pnuNiWCUSmEC5pblkHUXDvFislOUKKhnA_XMuXQlLx7fUQPzXiyVVAF2C4nkKYJiEND_hy5elXWHn-IWkk59snYWHz4l_HV-LjzCe84XUlIASy1PKfpt2dpVq-55NvJ272MG9WTJikEZAlYlpiKuq32tbGsE6D5Urup8_6nzeNVafhjnHoU5zrOxeAYpUk_7gjNVr_BsyDgkc0HlwlBrTdwOhwaTL6JYu0dsclypAzqmShaD7FxtE-jRLrPv9nNSRDo5JW7df-NTQydE8PNWBxIxjOCOmDreYyos3BW-WbusjpS3QJEzbJn353D3wQ`;

    let result = await verify(token);

    expect(result).toHaveProperty('status');
    expect(result.status).toBe('error');
    expect(result.data).toBe('Invalid token');
});



test('keycloak-lib - verify invalid realm', async () => {
    const savedRealm = process.env.KEYCLOAK_REALM;
    process.env.KEYCLOAK_REALM = 'INVALID_REALM';

    let tokenData = await authenticate('foo', '456');
    let token = tokenData.data.access_token;
    let result = await verify(token);

    expect(result).toHaveProperty('status');
    expect(result.status).toBe('error');
    expect(result.data).toBe('Invalid token');

    process.env.KEYCLOAK_REALM = savedRealm;
});

