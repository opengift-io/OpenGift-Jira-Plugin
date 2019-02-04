package opengift;

import com.atlassian.jira.web.action.JiraWebActionSupport;
import java.util.*;

public class AdminUi extends JiraWebActionSupport {

    public String doExecute() throws Exception {
        log.debug("Entering doSample1");
        return "input";
    }

    public String doDefault() throws Exception {
        log.debug("Entering doDefault");
        return "input";
    }
}
