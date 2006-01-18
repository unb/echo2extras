package nextapp.echo2.extras.webcontainer;

import org.w3c.dom.Element;

import nextapp.echo2.app.Color;
import nextapp.echo2.app.Component;
import nextapp.echo2.app.update.ServerComponentUpdate;
import nextapp.echo2.app.util.DomUtil;
import nextapp.echo2.extras.app.ColorSelect;
import nextapp.echo2.webcontainer.ComponentSynchronizePeer;
import nextapp.echo2.webcontainer.ContainerInstance;
import nextapp.echo2.webcontainer.PartialUpdateManager;
import nextapp.echo2.webcontainer.PropertyUpdateProcessor;
import nextapp.echo2.webcontainer.RenderContext;
import nextapp.echo2.webrender.ServerMessage;
import nextapp.echo2.webrender.Service;
import nextapp.echo2.webrender.ServiceRegistry;
import nextapp.echo2.webrender.WebRenderServlet;
import nextapp.echo2.webrender.servermessage.DomUpdate;
import nextapp.echo2.webrender.service.JavaScriptService;
import nextapp.echo2.webrender.service.StaticBinaryService;

/**
 * <code>ComponentSynchronizePeer</code> implementation for the
 * <code>ColorSelect</code> component.
 */
public class ColorSelectPeer
implements ComponentSynchronizePeer, PropertyUpdateProcessor {

    /**
     * Service to provide supporting JavaScript library.
     */
    public static final Service COLOR_SELECT_SERVICE = JavaScriptService.forResource("Echo2Extras.ColorSelect",
            "/nextapp/echo2/extras/webcontainer/resource/js/ColorSelect.js");
    
    private static final String IMAGE_RESOURCE_PATH = "/nextapp/echo2/extras/webcontainer/resource/image/"; 

    private static final Service H_LINE_IMAGE_SERVICE= StaticBinaryService.forResource(
            "Echo2Extras.ColorSelect.HLine", "image/gif", IMAGE_RESOURCE_PATH + "HLine.gif");
    private static final Service S_LINE_IMAGE_SERVICE= StaticBinaryService.forResource(
            "Echo2Extras.ColorSelect.SLine", "image/gif", IMAGE_RESOURCE_PATH + "SLine.gif");
    private static final Service V_LINE_IMAGE_SERVICE= StaticBinaryService.forResource(
            "Echo2Extras.ColorSelect.VLine", "image/gif", IMAGE_RESOURCE_PATH + "VLine.gif");
    private static final Service H_GRADIENT_IMAGE_SERVICE= StaticBinaryService.forResource(
            "Echo2Extras.ColorSelect.HGradient", "image/png", IMAGE_RESOURCE_PATH + "HGradient.png");
    private static final Service SV_GRADIENT_IMAGE_SERVICE= StaticBinaryService.forResource(
            "Echo2Extras.ColorSelect.SVGradient", "image/png", IMAGE_RESOURCE_PATH + "SVGradient.png");
    private static final Service TRANSPARENT_IMAGE_SERVICE= StaticBinaryService.forResource(
            "Echo2Extras.ColorSelect.Transparent", "image/gif", IMAGE_RESOURCE_PATH + "Transparent.gif");
    
    static {
        ServiceRegistry services = WebRenderServlet.getServiceRegistry();
        services.add(COLOR_SELECT_SERVICE);
        services.add(H_LINE_IMAGE_SERVICE);
        services.add(S_LINE_IMAGE_SERVICE);
        services.add(V_LINE_IMAGE_SERVICE);
        services.add(H_GRADIENT_IMAGE_SERVICE);
        services.add(SV_GRADIENT_IMAGE_SERVICE);
        services.add(TRANSPARENT_IMAGE_SERVICE);
    }
    
    /**
     * The <code>PartialUpdateManager</code> for this synchronization peer.
     */
    private PartialUpdateManager partialUpdateManager;
    
    /**
     * Default constructor.
     */
    public ColorSelectPeer() {
        partialUpdateManager = new PartialUpdateManager();
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
        ServerMessage serverMessage = rc.getServerMessage();
        serverMessage.addLibrary(COLOR_SELECT_SERVICE.getId());
        serverMessage.addLibrary(ExtrasUtil.SERVICE.getId());
        renderInitDirective(rc, targetId, (ColorSelect) component);
        renderSetColorDirective(rc, (ColorSelect) component);
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderDispose(nextapp.echo2.webcontainer.RenderContext,
     *      nextapp.echo2.app.update.ServerComponentUpdate,
     *      nextapp.echo2.app.Component)
     */
    public void renderDispose(RenderContext rc, ServerComponentUpdate update, Component component) {
        ServerMessage serverMessage = rc.getServerMessage();
        serverMessage.addLibrary(COLOR_SELECT_SERVICE.getId());
        serverMessage.addLibrary(ExtrasUtil.SERVICE.getId());
        renderDisposeDirective(rc, (ColorSelect) component);
    }

    /**
     * Renders a dispose directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param colorSelect the <code>ColorSelect</code> being rendered
     */
    private void renderDisposeDirective(RenderContext rc, ColorSelect colorSelect) {
        String elementId = ContainerInstance.getElementId(colorSelect);
        ServerMessage serverMessage = rc.getServerMessage();
        Element initElement = serverMessage.appendPartDirective(ServerMessage.GROUP_ID_PREREMOVE, 
                "ExtrasColorSelect.MessageProcessor", "dispose");
        initElement.setAttribute("eid", elementId);
    }

    /**
     * Renders an initialization directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param containerId the container element id
     * @param colorSelect the <code>ColorSelect</code> being rendered
     */
    private void renderInitDirective(RenderContext rc, String containerId, ColorSelect colorSelect) {
        String elementId = ContainerInstance.getElementId(colorSelect);
        ServerMessage serverMessage = rc.getServerMessage();
        Element initElement = serverMessage.appendPartDirective(ServerMessage.GROUP_ID_UPDATE, 
                "ExtrasColorSelect.MessageProcessor", "init");
        initElement.setAttribute("eid", elementId);
        initElement.setAttribute("container-eid", containerId);
    }
    
    /**
     * Renders an set-color directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param colorSelect the <code>ColorSelect</code> being rendered
     */
    private void renderSetColorDirective(RenderContext rc, ColorSelect colorSelect) {
        String elementId = ContainerInstance.getElementId(colorSelect);
        ServerMessage serverMessage = rc.getServerMessage();
        Element initElement = serverMessage.appendPartDirective(ServerMessage.GROUP_ID_UPDATE, 
                "ExtrasColorSelect.MessageProcessor", "set-color");
        initElement.setAttribute("eid", elementId);
        
        Color color = colorSelect.getColor();
        if (color != null) {
            initElement.setAttribute("r", Integer.toString(color.getRed()));
            initElement.setAttribute("g", Integer.toString(color.getGreen()));
            initElement.setAttribute("b", Integer.toString(color.getBlue()));
        }
    }

    /**
     * @see nextapp.echo2.webcontainer.PropertyUpdateProcessor#processPropertyUpdate(nextapp.echo2.webcontainer.ContainerInstance,
     *      nextapp.echo2.app.Component, org.w3c.dom.Element)
     */
    public void processPropertyUpdate(ContainerInstance ci, Component component, Element element) {
        Element selectionElement = DomUtil.getChildElementByTagName(element, "color");
        int r = Integer.parseInt(selectionElement.getAttribute("r"));
        int g = Integer.parseInt(selectionElement.getAttribute("g"));
        int b = Integer.parseInt(selectionElement.getAttribute("b"));
        ci.getUpdateManager().getClientUpdateManager().setComponentProperty(component, 
                ColorSelect.COLOR_CHANGED_PROPERTY, new Color(r, g, b));
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