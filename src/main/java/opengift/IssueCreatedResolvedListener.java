package opengift;
import com.atlassian.event.api.EventListener;
import com.atlassian.event.api.EventPublisher;
import com.atlassian.jira.event.issue.IssueEvent;
import com.atlassian.jira.event.type.EventType;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.comments.CommentManager;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.jira.user.UserUtils;
import com.atlassian.plugin.spring.scanner.annotation.imports.JiraImport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.atlassian.jira.user.util.UserUtil;
import com.atlassian.jira.component.ComponentAccessor;
import java.util.Collection;
import com.atlassian.sal.api.net.RequestFactory;
import com.atlassian.sal.api.net.Request;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.lang.StringBuilder;

@Component
public class IssueCreatedResolvedListener implements InitializingBean, DisposableBean {
    private static final Logger log = LoggerFactory.getLogger(IssueCreatedResolvedListener.class);

    @JiraImport
    private final EventPublisher eventPublisher;

    @Autowired
    public IssueCreatedResolvedListener(EventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    /**
     * Called when the plugin has been enabled.
     * @throws Exception
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        log.error("Enabling plugin");
        System.out.println("saafasdasfdadsfsa");
        eventPublisher.register(this);
    }

    /**
     * Called when the plugin is being disabled or removed.
     * @throws Exception
     */
    @Override
    public void destroy() throws Exception {
        log.error("Disabling plugin");
        eventPublisher.unregister(this);
    }

    @EventListener
    public void onIssueEvent(IssueEvent issueEvent) {
        Long eventTypeId = issueEvent.getEventTypeId();
        Issue issue = issueEvent.getIssue();
        CommentManager commentManager = ComponentAccessor.getCommentManager();
        boolean dispatchEvent = false;
        ApplicationUser myUser = UserUtils.getUser("admin");

        String request = getData("https://ya.ru");
        System.out.println(request);
        if (eventTypeId.equals(EventType.ISSUE_CREATED_ID)) {
            commentManager.create(issue, myUser, "adssasadsadsadasdsa", dispatchEvent);
            System.out.println("Issue "+issue.getKey()+" has been created at "+issue.getCreated()+".");
        } else if (eventTypeId.equals(EventType.ISSUE_RESOLVED_ID)) {
            log.error("Issue {} has been resolved at {}.", issue.getKey(), issue.getResolutionDate());
        } else if (eventTypeId.equals(EventType.ISSUE_CLOSED_ID)) {
            log.error("Issue {} has been closed at {}.", issue.getKey(), issue.getUpdated());
        }
    }


    private String getData(String desiredUrl){
        try
        {
            // create the HttpURLConnection
            URL url = new URL(desiredUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // just want to do an HTTP GET here
            connection.setRequestMethod("GET");

            // uncomment this if you want to write output to this url
            //connection.setDoOutput(true);

            // give it 15 seconds to respond
            connection.setReadTimeout(15*1000);
            connection.connect();

            // read the output from the server
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder stringBuilder = new StringBuilder();

            String line = null;
            while ((line = reader.readLine()) != null)
            {
                stringBuilder.append(line + "\n");
            }
            return stringBuilder.toString();
        }
        catch (Exception e)
        {
            return "";
        }
    }

}