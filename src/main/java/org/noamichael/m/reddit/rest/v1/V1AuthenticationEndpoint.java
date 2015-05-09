package org.noamichael.m.reddit.rest.v1;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.noamichael.m.reddit.session.Identity;

/**
 *
 * @author Michael
 */
@Path("/auth")
@RequestScoped
public class V1AuthenticationEndpoint {
    @Inject
    private Identity identity;
    
    @GET
    @Path("/token")
    @Produces({MediaType.TEXT_PLAIN})
    public Response doGetSessionToken(){
        return Response.ok(identity.getToken()).build();
    }
}
