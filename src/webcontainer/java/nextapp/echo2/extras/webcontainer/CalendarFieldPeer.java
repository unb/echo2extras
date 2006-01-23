package nextapp.echo2.extras.webcontainer;

import java.util.Calendar;
import java.util.GregorianCalendar;

import org.w3c.dom.Element;

import nextapp.echo2.app.Border;
import nextapp.echo2.app.Color;
import nextapp.echo2.app.Component;
import nextapp.echo2.app.Font;
import nextapp.echo2.app.update.ServerComponentUpdate;
import nextapp.echo2.app.util.DomUtil;
import nextapp.echo2.extras.app.CalendarField;
import nextapp.echo2.webcontainer.ComponentSynchronizePeer;
import nextapp.echo2.webcontainer.ContainerInstance;
import nextapp.echo2.webcontainer.PartialUpdateManager;
import nextapp.echo2.webcontainer.PartialUpdateParticipant;
import nextapp.echo2.webcontainer.PropertyUpdateProcessor;
import nextapp.echo2.webcontainer.RenderContext;
import nextapp.echo2.webcontainer.propertyrender.BorderRender;
import nextapp.echo2.webcontainer.propertyrender.ColorRender;
import nextapp.echo2.webcontainer.propertyrender.ExtentRender;
import nextapp.echo2.webcontainer.propertyrender.FontRender;
import nextapp.echo2.webrender.ServerMessage;
import nextapp.echo2.webrender.Service;
import nextapp.echo2.webrender.WebRenderServlet;
import nextapp.echo2.webrender.servermessage.DomUpdate;
import nextapp.echo2.webrender.service.JavaScriptService;

/**
 * <code>ComponentSynchronizePeer</code> implementation for the
 * <code>CalendarField</code> component.
 */
public class CalendarFieldPeer
implements ComponentSynchronizePeer, PropertyUpdateProcessor {
    
    /**
     * Service to provide supporting JavaScript library.
     */
    public static final Service CALENDAR_FIELD_SERVICE = JavaScriptService.forResource("Echo2Extras.CalendarField",
            "/nextapp/echo2/extras/webcontainer/resource/js/CalendarField.js");

    static {
        WebRenderServlet.getServiceRegistry().add(CALENDAR_FIELD_SERVICE);
    }
    
    /**
     * The <code>PartialUpdateManager</code> for this synchronization peer.
     */
    private PartialUpdateManager partialUpdateManager;
    
    /**
     * <code>PartialUpdateParticipant</code> to set date.
     */
    private PartialUpdateParticipant setDateUpdateParticipant = new PartialUpdateParticipant() {
    
        /**
         * @see nextapp.echo2.webcontainer.PartialUpdateParticipant#renderProperty(nextapp.echo2.webcontainer.RenderContext,
         *       nextapp.echo2.app.update.ServerComponentUpdate)
         */
        public void renderProperty(RenderContext rc, ServerComponentUpdate update) {
            renderSetDateDirective(rc, (CalendarField) update.getParent());
        }
    
        /**
         * @see nextapp.echo2.webcontainer.PartialUpdateParticipant#canRenderProperty(nextapp.echo2.webcontainer.RenderContext, 
         *      nextapp.echo2.app.update.ServerComponentUpdate)
         */
        public boolean canRenderProperty(RenderContext rc, ServerComponentUpdate update) {
            return true;
        }
    };

    /**
     * Default constructor.
     */
    public CalendarFieldPeer() {
        partialUpdateManager = new PartialUpdateManager();
        partialUpdateManager.add(CalendarField.DATE_CHANGED_PROPERTY, setDateUpdateParticipant);
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#getContainerId(nextapp.echo2.app.Component)
     */
    public String getContainerId(Component component) {
        throw new UnsupportedOperationException("Component does not support children.");
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderAdd(nextapp.echo2.webcontainer.RenderContext,
     *      nextapp.echo2.app.update.ServerComponentUpdate, java.lang.String,
     *      nextapp.echo2.app.Component)
     */
    public void renderAdd(RenderContext rc, ServerComponentUpdate update, String targetId, Component component) {
        rc.getServerMessage().addLibrary(CALENDAR_FIELD_SERVICE.getId());
        renderInitDirective(rc, targetId, (CalendarField) component);
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderDispose(nextapp.echo2.webcontainer.RenderContext,
     *      nextapp.echo2.app.update.ServerComponentUpdate,
     *      nextapp.echo2.app.Component)
     */
    public void renderDispose(RenderContext rc, ServerComponentUpdate update, Component component) {
        rc.getServerMessage().addLibrary(CALENDAR_FIELD_SERVICE.getId());
        renderDisposeDirective(rc, (CalendarField) component);
    }

    /**
     * Renders a dispose directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param calendarField the <code>CalendarField</code> being rendered
     */
    private void renderDisposeDirective(RenderContext rc, CalendarField calendarField) {
        String elementId = ContainerInstance.getElementId(calendarField);
        ServerMessage serverMessage = rc.getServerMessage();
        Element initElement = serverMessage.appendPartDirective(ServerMessage.GROUP_ID_PREREMOVE, 
                "ExtrasCalendarField.MessageProcessor", "dispose");
        initElement.setAttribute("eid", elementId);
    }

    /**
     * Renders an initialization directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param containerId the container element id
     * @param calendarField the <code>CalendarField</code> being rendered
     */
    private void renderInitDirective(RenderContext rc, String containerId, CalendarField calendarField) {
        String elementId = ContainerInstance.getElementId(calendarField);
        ServerMessage serverMessage = rc.getServerMessage();
        Element initElement = serverMessage.appendPartDirective(ServerMessage.GROUP_ID_UPDATE, 
                "ExtrasCalendarField.MessageProcessor", "init");
        initElement.setAttribute("eid", elementId);
        initElement.setAttribute("container-eid", containerId);

        Calendar calendar = new GregorianCalendar();
        if (calendarField.getDate() != null) {
            calendar.setTime(calendarField.getDate());
        }
        initElement.setAttribute("year", Integer.toString(calendar.get(Calendar.YEAR)));
        initElement.setAttribute("month", Integer.toString(calendar.get(Calendar.MONTH)));
        initElement.setAttribute("date", Integer.toString(calendar.get(Calendar.DATE)));
        
        Color background = (Color) calendarField.getRenderProperty(CalendarField.PROPERTY_BACKGROUND);
        if (background != null) {
            initElement.setAttribute("background", ColorRender.renderCssAttributeValue(background));
        }
        Color foreground = (Color) calendarField.getRenderProperty(CalendarField.PROPERTY_FOREGROUND);
        if (foreground != null) {
            initElement.setAttribute("foreground", ColorRender.renderCssAttributeValue(foreground));
        }
        Font font =  (Font) calendarField.getRenderProperty(CalendarField.PROPERTY_FONT);
        if (font != null) {
            if (font.getTypeface() != null) {
                initElement.setAttribute("font-family", FontRender.renderFontFamilyCssAttributeValue(font.getTypeface()));
            }
            if (font.getSize() != null) {
                initElement.setAttribute("font-size", ExtentRender.renderCssAttributeValue(font.getSize()));
            }
            initElement.setAttribute("font-style", FontRender.renderFontStyleCssAttributeValue(font));
            initElement.setAttribute("font-weight", FontRender.renderFontWeightCssAttributeValue(font));
            initElement.setAttribute("text-decoration", FontRender.renderTextDecorationCssAttributeValue(font));
        }
        Border border = (Border) calendarField.getRenderProperty(CalendarField.PROPERTY_BORDER);
        if (border != null) {
            initElement.setAttribute("border", BorderRender.renderCssAttributeValue(border));
        }
    }

    /**
     * @see nextapp.echo2.webcontainer.PropertyUpdateProcessor#processPropertyUpdate(nextapp.echo2.webcontainer.ContainerInstance,
     *      nextapp.echo2.app.Component, org.w3c.dom.Element)
     */
    public void processPropertyUpdate(ContainerInstance ci, Component component, Element element) {
        Element selectionElement = DomUtil.getChildElementByTagName(element, "calendar-selection");
        int month = Integer.parseInt(selectionElement.getAttribute("month"));
        int year = Integer.parseInt(selectionElement.getAttribute("year"));
        int date = selectionElement.hasAttribute("date") ? Integer.parseInt(selectionElement.getAttribute("date")) : -1;
        
        if (date == -1) {
            ci.getUpdateManager().getClientUpdateManager().setComponentProperty(component, 
                    CalendarField.DATE_CHANGED_PROPERTY, null);
        } else {
            Calendar calendar = new GregorianCalendar(year, month, date);
            ci.getUpdateManager().getClientUpdateManager().setComponentProperty(component, 
                    CalendarField.DATE_CHANGED_PROPERTY, calendar.getTime());
        }
    }

    /**
     * Renders a set-date directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param calendarField the <code>CalendarField</code> being rendered
     */
    private void renderSetDateDirective(RenderContext rc, CalendarField calendarField) {
        String elementId = ContainerInstance.getElementId(calendarField);
        ServerMessage serverMessage = rc.getServerMessage();
        Element setDateElement = serverMessage.appendPartDirective(ServerMessage.GROUP_ID_UPDATE, 
                "ExtrasCalendarField.MessageProcessor", "set-date");
        setDateElement.setAttribute("eid", elementId);
        
        Calendar calendar = new GregorianCalendar();
        if (calendarField.getDate() != null) {
            calendar.setTime(calendarField.getDate());
            setDateElement.setAttribute("year", Integer.toString(calendar.get(Calendar.YEAR)));
            setDateElement.setAttribute("month", Integer.toString(calendar.get(Calendar.MONTH)));
            setDateElement.setAttribute("date", Integer.toString(calendar.get(Calendar.DATE)));
        }
    }
    
    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderUpdate(nextapp.echo2.webcontainer.RenderContext,
     *      nextapp.echo2.app.update.ServerComponentUpdate, java.lang.String)
     */
    public boolean renderUpdate(RenderContext rc, ServerComponentUpdate update, String targetId) {
        // Determine if fully replacing the component is required.
        if (partialUpdateManager.canProcess(rc, update)) {
            partialUpdateManager.process(rc, update);
        } else {
            // Perform full update.
            DomUpdate.renderElementRemove(rc.getServerMessage(), ContainerInstance.getElementId(update.getParent()));
            renderAdd(rc, update, targetId, update.getParent());
        }
        
        return true;
    }
}