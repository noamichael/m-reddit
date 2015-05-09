package org.noamichael.m.reddit.session;

import java.io.Serializable;
import java.util.UUID;
import javax.enterprise.context.SessionScoped;

/**
 *
 * @author Michael
 */
@SessionScoped
public class Identity implements Serializable {

    private final String token = UUID.randomUUID().toString();

    /**
     * @return the token
     */
    public String getToken() {
        return token;
    }
}
