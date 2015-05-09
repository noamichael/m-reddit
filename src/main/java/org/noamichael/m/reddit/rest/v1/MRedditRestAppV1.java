package org.noamichael.m.reddit.rest.v1;

import java.util.Set;
import org.noamichael.m.reddit.rest.VersionedApplication;

/**
 *
 * @author Michael
 */
public class MRedditRestAppV1 extends VersionedApplication{

    @Override
    public void findVersionEndpoints(Set<Class<?>> resultList) {
        resultList.add(V1AuthenticationEndpoint.class);
    }


    
}
