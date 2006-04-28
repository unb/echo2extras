/* 
 * This file is part of the Echo2 Extras Project.
 * Copyright (C) 2005-2006 NextApp, Inc.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 */

/**
 * ExtrasTransitionPane Object/Namespace/Constructor.
 *
 * @param elementId the root id of the TransitionPane.
 * @param containerElementId the id of the DOM element which will contain the 
 *        TransitionPane.
 */
ExtrasTransitionPane = function(elementId, containerElementId) {
    this.elementId = elementId;
    this.containerElementId = containerElementId;
    this.transitionDuration = -1;
    this.initialized = false;
    
    this.transition = null; 
};

/**
 * Default transition duration: 350ms.
 */
ExtrasTransitionPane.DEFAULT_TRANSITION_DURATION = 350;

ExtrasTransitionPane.prototype.addChild = function(childId) {
    this.clearTransition();
    this.newChildDivElement = document.createElement("div");
    this.newChildDivElement.id = this.elementId + "_content_" + childId;
    this.newChildDivElement.style.position = "absolute";
    this.newChildDivElement.style.top = "0px";
    this.newChildDivElement.style.left =  "0px";
    this.newChildDivElement.style.width =  "100%";
    this.newChildDivElement.style.height = "100%";
    if (this.initialized) {
        this.newChildDivElement.style.display = "none";
    } else {
        this.initialized = true;
    }
    this.transitionPaneDivElement.appendChild(this.newChildDivElement);
};

ExtrasTransitionPane.prototype.create = function() {
    var containerElement = document.getElementById(this.containerElementId);
    if (!containerElement) {
        throw "Container element not found: " + this.containerElementId;
    }

    this.transitionPaneDivElement = document.createElement("div");
    this.transitionPaneDivElement.id = this.elementId;
    this.transitionPaneDivElement.style.position = "absolute";
    this.transitionPaneDivElement.style.overflow = "hidden";
    
    this.transitionPaneDivElement.style.top = "0px";
    this.transitionPaneDivElement.style.left =  "0px";
    this.transitionPaneDivElement.style.width =  "100%";
    this.transitionPaneDivElement.style.height = "100%";
    
    containerElement.appendChild(this.transitionPaneDivElement);
    
    EchoDomPropertyStore.setPropertyValue(this.elementId, "component", this);
};

ExtrasTransitionPane.prototype.clearTransition = function() {
    if (this.timeout) {
        window.clearTimeout(this.timeout);
        this.timeout = null;
    }
    if (this.transitionActive) {
        this.transition.dispose();
        this.transitionActive = false;
    }
};

ExtrasTransitionPane.prototype.dispose = function() {
    EchoDomPropertyStore.dispose(this.transitionPaneDivElement);
    this.transitionPaneDivElement = null;
};

ExtrasTransitionPane.prototype.doImmediateTransition = function() {
    if (this.oldChildDivElement) {
        this.transitionPaneDivElement.removeChild(this.oldChildDivElement);

        // Clear reference.
        this.oldChildDivElement = null;
    }
    if (this.newChildDivElement) {
        this.newChildDivElement.style.display = "block";
        
        // Clear reference.
        this.newChildDivElement = null;

        EchoVirtualPosition.redraw();
    }
};

ExtrasTransitionPane.prototype.doTransition = function() {
    this.transitionStartTime = new Date().getTime();
    this.transitionStep(true);
};

ExtrasTransitionPane.prototype.removeChild = function(childId) {
    this.clearTransition();
    this.oldChildDivElement = document.getElementById(this.elementId + "_content_" + childId);
    this.stripIds(this.oldChildDivElement);
};

ExtrasTransitionPane.prototype.setTransition = function(transition) {
    this.clearTransition();
    this.transition = transition;
};

ExtrasTransitionPane.prototype.stripIds = function(element) {
    var length = element.childNodes.length;
    for (var i = 0; i < length; ++i) {
        if (element.childNodes[i].nodeType == 1) {
            element.childNodes[i].id = null;
            if (element.childNodes[i].childNodes.length > 0) {
                this.stripIds(element.childNodes[i]);
            }
        }
    }
};

ExtrasTransitionPane.prototype.transitionStep = function(firstStep) {
    // Method is invoked from timeout, which has now completed, thus it is removed.
    this.timeout = null;
    
    if (firstStep) {
        if (this.transition) {
            this.transitionActive = true;
            this.transition.init();

            // Configure duration setting.
            if (this.transitionDuration < 0) {
                if (this.transition.transitionDuration) {
                    // Use transition duration specified by running transition.
                    this.activeTransitionDuration = this.transition.transitionDuration;
                } else {
                    // Use global default duration.
                    this.activeTransitionDuration = ExtrasTransitionPane.DEFAULT_TRANSITION_DURATION;
                }
            } else {
                // A specific duration has been configured, override default.
                this.activeTransitionDuration = this.transitionDuration;
            }
            
            this.timeout = window.setTimeout("ExtrasTransitionPane.processTimeout(\"" + this.elementId + "\");", 1);
        } else {
            this.doImmediateTransition();
        }
    } else {
        var time = new Date().getTime();
        var progress = (time - this.transitionStartTime) / this.activeTransitionDuration;
    
        if (progress < 1) {
            this.transition.step(progress);
            this.timeout = window.setTimeout("ExtrasTransitionPane.processTimeout(\"" + this.elementId + "\");", 1);
        } else {
            this.transition.dispose();
            this.transitionActive = false;
        }
    }
};

ExtrasTransitionPane.getComponent = function(transitionPaneId) {
    return EchoDomPropertyStore.getPropertyValue(transitionPaneId, "component");
};

ExtrasTransitionPane.processTimeout = function(transitionPaneId) {
    var transitionPane = ExtrasTransitionPane.getComponent(transitionPaneId);
    transitionPane.transitionStep();
};

/**
 * Static object/namespace for TransitionPane MessageProcessor 
 * implementation.
 */
ExtrasTransitionPane.MessageProcessor = function() { };

ExtrasTransitionPane.MessageProcessor.installTransition = function(transitionPane, type) {
    switch (type) {
    case "camera-pan-left":
        transitionPane.setTransition(new ExtrasTransitionPane.CameraPan(transitionPane, false));
        break;
    case "camera-pan-right":
        transitionPane.setTransition(new ExtrasTransitionPane.CameraPan(transitionPane, true));
        break;
    case "blind-black-in":
        transitionPane.setTransition(new ExtrasTransitionPane.Blind(transitionPane, false));
        break;
    case "blind-black-out":
        transitionPane.setTransition(new ExtrasTransitionPane.Blind(transitionPane, true));
        break;
    default:
        transitionPane.setTransition(null);
    }
};

/**
 * MessageProcessor process() implementation 
 * (invoked by ServerMessage processor).
 *
 * @param messagePartElement the <code>message-part</code> element to process.
 */
ExtrasTransitionPane.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType === 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "add-child":
                ExtrasTransitionPane.MessageProcessor.processAddChild(messagePartElement.childNodes[i]);
                break;
            case "dispose":
                ExtrasTransitionPane.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            case "init":
                ExtrasTransitionPane.MessageProcessor.processInit(messagePartElement.childNodes[i]);
                break;
            case "remove-child":
                ExtrasTransitionPane.MessageProcessor.processRemoveChild(messagePartElement.childNodes[i]);
                break;
            case "set-type":
                ExtrasTransitionPane.MessageProcessor.processSetType(messagePartElement.childNodes[i]);
                break;
            case "transition":
                ExtrasTransitionPane.MessageProcessor.processTransition(messagePartElement.childNodes[i]);
                break;
            }
        }
    }
};

/**
 * Processes an <code>add-child</code> message to add a new child to the TransitionPane.
 *
 * @param addChildMessageElement the <code>add-child</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processAddChild = function(addChildMessageElement) {
    var elementId = addChildMessageElement.getAttribute("eid");
    var transitionPane = ExtrasTransitionPane.getComponent(elementId);
    if (!transitionPane) {
        throw "TransitionPane not found with id: " + elementId;
    }
    var childId = addChildMessageElement.getAttribute("child-id");
    transitionPane.addChild(childId);
};

/**
 * Processes an <code>dispose</code> message to dispose the state of a 
 * TransitionPane component that is being removed.
 *
 * @param disposeMessageElement the <code>dispose</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processDispose = function(disposeMessageElement) {
    var elementId = disposeMessageElement.getAttribute("eid");
    var transitionPane = ExtrasTransitionPane.getComponent(elementId);
    if (transitionPane) {
        transitionPane.dispose();
    }
};

/**
 * Processes an <code>init</code> message to initialize the state of a 
 * TransitionPane component that is being added.
 *
 * @param initMessageElement the <code>init</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var transitionPane = new ExtrasTransitionPane(elementId, containerElementId);

    var type = initMessageElement.getAttribute("type");
    ExtrasTransitionPane.MessageProcessor.installTransition(transitionPane, type);

    transitionPane.create();
};

/**
 * Processes a <code>remove-child</code> message to remove a child from the 
 * TransitionPane.
 * 
 * @param removeChildMessageElement the <code>remove-child</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processRemoveChild = function(removeChildMessageElement) {
    var elementId = removeChildMessageElement.getAttribute("eid");
    var transitionPane = ExtrasTransitionPane.getComponent(elementId);
    if (!transitionPane) {
        throw "TransitionPane not found with id: " + elementId;
    }
    var childId = removeChildMessageElement.getAttribute("child-id");
    transitionPane.removeChild(childId);
};

/**
 * Processes a <code>set-type</code> message to change the transition type..
 *
 * @param setTypeMessageElement the <code>set-type</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processSetType = function(setTypeMessageElement) {
    var elementId = setTypeMessageElement.getAttribute("eid");
    var transitionPane = ExtrasTransitionPane.getComponent(elementId);
    if (!transitionPane) {
        throw "TransitionPane not found with id: " + elementId;
    }
    
    var type = setTypeMessageElement.getAttribute("type");
    ExtrasTransitionPane.MessageProcessor.installTransition(transitionPane, type);
};

/**
 * Processes a <code>transition</code> message to start a transition.
 *
 * @param transitionMessageElement the <code>transition</code> element to process
 */
ExtrasTransitionPane.MessageProcessor.processTransition = function(transitionMessageElement) {
    var elementId = transitionMessageElement.getAttribute("eid");
    var transitionPane = ExtrasTransitionPane.getComponent(elementId);
    if (!transitionPane) {
        throw "TransitionPane not found with id: " + elementId;
    }
    transitionPane.doTransition();
};

/**
 * Blind transition. 
 */
ExtrasTransitionPane.Blind = function(transitionPane, reverseAnimation) {
    this.transitionDuration = 700;
    this.transitionPane = transitionPane;
    this.reverseAnimation = reverseAnimation;
    this.renderedAnimationStep = 0;
    this.totalAnimationSteps = 14;
    this.contentSwapAnimationStep = Math.floor(this.totalAnimationSteps) / 2 + 1;
    this.imagePrefix = "blindblack-";
    
    // Precache images.
    for (var i = 1; i <= this.totalAnimationSteps; ++i) {
        var image = new Image();
        image.src = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.TransitionPane.Image&imageId=" 
                + this.imagePrefix + i;
    }
};

ExtrasTransitionPane.Blind.prototype.dispose = function() {
    this.transitionPane.transitionPaneDivElement.removeChild(this.blindElement);
    this.blindElement = null;
    this.transitionPane.doImmediateTransition();
};

ExtrasTransitionPane.Blind.prototype.init = function() {
    this.blindElement = document.createElement("div");
    this.blindElement.style.position = "absolute";
    this.blindElement.style.zIndex = 2;
    this.blindElement.style.left = "0px";
    this.blindElement.style.top = "0px";
    this.blindElement.style.width = "100%";
    this.blindElement.style.height = "100%";
    if (this.transitionPane.oldChildDivElement) {
        this.transitionPane.oldChildDivElement.style.zIndex = 1;
    }
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.zIndex = 1;
    }
    this.transitionPane.transitionPaneDivElement.appendChild(this.blindElement);
};

ExtrasTransitionPane.Blind.prototype.step = function(progress) {
    var currentAnimationStep = Math.ceil(progress * this.totalAnimationSteps);
    if (currentAnimationStep == 0) {
        currentAnimationStep = 1;
    }
    if (currentAnimationStep == this.renderedAnimationStep) {
        // No need for update, already current.
        return;
    }
    
    var frameNumber = this.reverseAnimation ? this.totalAnimationAnimationSteps - currentAnimationStep + 1 
            : currentAnimationStep;
    
    var imgUrl = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.TransitionPane.Image&imageId=" 
            + this.imagePrefix + currentAnimationStep;
    
    if (EchoClientProperties.get("proprietaryIEPngAlphaFilterRequired")) {
    }

    this.blindElement.style.backgroundImage = "url(" + imgUrl + ")";
    
    if (currentAnimationStep < this.contentSwapAnimationStep) {
        if (this.transitionPane.oldChildDivElement) {
            if (this.reverseAnimation) {
                this.transitionPane.oldChildDivElement.style.top = 
                        (this.contentSwapAnimationStep - currentAnimationStep) + "px";
            } else {
                this.transitionPane.oldChildDivElement.style.top = (0 - currentAnimationStep) + "px";
            }
        }
    } else {
        if (this.renderedAnimationStep < this.contentSwapAnimationStep) {
            // blind is crossing horizontal, swap content.
            if (this.transitionPane.oldChildDivElement) {
                this.transitionPane.oldChildDivElement.style.display = "none";
            }
            if (this.transitionPane.newChildDivElement) {
                this.transitionPane.newChildDivElement.style.display = "block";
                EchoVirtualPosition.redraw();
            }
        }
        if (this.transitionPane.newChildDivElement) {
            if (this.reverseAnimation) {
                this.transitionPane.newChildDivElement.style.top 
                        = (currentAnimationStep - this.totalAnimationSteps) + "px";
            } else {
                this.transitionPane.newChildDivElement.style.top 
                        = (this.totalAnimationSteps - currentAnimationStep) + "px";
            }
        }
    }
    
    this.renderedAnimationStep = currentAnimationStep;
};

/**
 * Camera-Pantransition. 
 */
ExtrasTransitionPane.CameraPan = function(transitionPane, right) {
    this.transitionPane = transitionPane;
    this.right = right;
};

ExtrasTransitionPane.CameraPan.prototype.dispose = function() {
    this.widthTravel = null;
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.zIndex = 0;
        this.transitionPane.newChildDivElement.style.left = "0px";
    }
    this.transitionPane.doImmediateTransition();
};

ExtrasTransitionPane.CameraPan.prototype.init = function() {
    var bounds = new EchoCssUtil.Bounds(this.transitionPane.transitionPaneDivElement);
    this.widthTravel = bounds.width;
    if (this.transitionPane.oldChildDivElement) {
        this.transitionPane.oldChildDivElement.style.zIndex = 1;
    }
    if (this.transitionPane.newChildDivElement) {
        this.transitionPane.newChildDivElement.style.zIndex = 2;
        this.transitionPane.newChildDivElement.style.left = (0 - this.widthTravel) + "px";
        this.transitionPane.newChildDivElement.style.display = "block";
    }
};

ExtrasTransitionPane.CameraPan.prototype.step = function(progress) {
    if (this.right) {
        if (this.transitionPane.newChildDivElement) {
            this.transitionPane.newChildDivElement.style.left = ((1 - progress) * this.widthTravel) + "px";
        }
        if (this.transitionPane.oldChildDivElement) {
            this.transitionPane.oldChildDivElement.style.left = (0 - (progress * this.widthTravel)) + "px";
        }
    } else {
        if (this.transitionPane.newChildDivElement) {
            this.transitionPane.newChildDivElement.style.left = (0 - ((1 - progress) * this.widthTravel)) + "px";
        }
        if (this.transitionPane.oldChildDivElement) {
            this.transitionPane.oldChildDivElement.style.left = (progress * this.widthTravel) + "px";
        }
    }
};