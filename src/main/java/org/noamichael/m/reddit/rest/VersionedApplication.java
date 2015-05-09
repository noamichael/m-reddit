package org.noamichael.m.reddit.rest;

import java.util.HashSet;
import java.util.Set;
import javax.ws.rs.core.Application;

/**
 *
 * @author Michael
 */
public abstract class VersionedApplication extends Application {
    
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> cl = new HashSet<>();
        findVersionEndpoints(cl);
        return cl;
    }
    
    public abstract void findVersionEndpoints(Set<Class<?>> resultList);
    
}
