import { Class,Directive,ChangeDetectionStrategy,Component } from '@angular/core';

function makeDecorator(name, props, parentClass, chainFn) {
    if (chainFn === void 0) { chainFn = null; }
    var metaCtor = makeMetadataCtor([props]);
    
    function DecoratorFactory(objOrType) {
        if (!(Reflect && (<any>Reflect).getOwnMetadata)) {
            throw 'reflect-metadata shim is required when using class decorators';
        }
        if (this instanceof DecoratorFactory) {
            metaCtor.call(this, objOrType);
            return this;
        }
        var annotationInstance = new ((Component))(objOrType);
        var chainAnnotation = typeof this === 'function' && Array.isArray(this.annotations) ? this.annotations : [];
        chainAnnotation.push(annotationInstance);
        var TypeDecorator = (function TypeDecorator(cls) {
            var parentCtor = Object.getPrototypeOf(cls.prototype).constructor;
            var annotations = (<any>Reflect).getOwnMetadata('annotations', cls) || [];
            var parentAnnotations = (<any>Reflect).getOwnMetadata('annotations', parentCtor) || [];

            if(parentAnnotations && parentAnnotations.length){
                var parentAnnotation = parentAnnotations[parentAnnotations.length - 1];
                // for (var propName in annotationInstance) {
                for (var propName in parentAnnotation) {
                    if(parentAnnotation[propName] && !annotationInstance[propName]){
                        // parentAnnotation[propName] = annotationInstance[propName];
                        annotationInstance[propName] = parentAnnotation[propName];
                    }
                }
            }

            annotations.push(annotationInstance);

            // (<any>Reflect).defineMetadata('annotations', annotations, parentCtor);
            (<any>Reflect).defineMetadata('annotations', annotations, cls);
            return cls;
        });
        (<any>TypeDecorator).annotations = chainAnnotation;
        (<any>TypeDecorator).Class = Class;
        if (chainFn)
            chainFn(TypeDecorator);
        return TypeDecorator;
    }
    if (parentClass) {
        DecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    DecoratorFactory.prototype.toString = function () { return ("@" + name); };
    (<any>((DecoratorFactory))).annotationCls = DecoratorFactory;
    return DecoratorFactory;
}

function makeMetadataCtor(props) {
    return function ctor() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        props.forEach(function (prop, i) {
            var argVal = args[i];
            if (Array.isArray(prop)) {
                // plain parameter
                _this[prop[0]] = argVal === undefined ? prop[1] : argVal;
            }
            else {
                for (var propName in prop) {
                    _this[propName] =
                        argVal && argVal.hasOwnProperty(propName) ? argVal[propName] : prop[propName];
                }
            }
        });
    };
}

/**
 * Component decorator and metadata.
 *
 * @ yiocio
 */
export var  ExtendComponent = (makeDecorator('Component', {
    selector: undefined,
    inputs: undefined,
    outputs: undefined,
    host: undefined,
    exportAs: undefined,
    moduleId: undefined,
    providers: undefined,
    viewProviders: undefined,
    changeDetection: ChangeDetectionStrategy.Default,
    queries: undefined,
    "templateUrl": undefined,
    template: undefined,
    styleUrls: undefined,
    styles: undefined,
    animations: undefined,
    encapsulation: undefined,
    interpolation: undefined,
    entryComponents: undefined
}, Directive,null));

