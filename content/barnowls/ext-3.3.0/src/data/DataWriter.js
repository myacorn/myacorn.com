/*!
 * Ext JS Library 3.3.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * @class Ext.data.DataWriter
 * <p>Ext.data.DataWriter facilitates create, update, and destroy actions between
 * an Ext.data.Store and a server-side framework. A Writer enabled Store will
 * automatically manage the Ajax requests to perform CRUD actions on a Store.</p>
 * <p>Ext.data.DataWriter is an abstract base class which is intended to be extended
 * and should not be created directly. For existing implementations, see
 * {@link Ext.data.JsonWriter}.</p>
 * <p>Creating a writer is simple:</p>
 * <pre><code>
var writer = new Ext.data.JsonWriter({
    encode: false   // &lt;--- false causes data to be printed to jsonData config-property of Ext.Ajax#reqeust
});
 * </code></pre>
 * * <p>Same old JsonReader as Ext-2.x:</p>
 * <pre><code>
var reader = new Ext.data.JsonReader({idProperty: 'id'}, [{name: 'first'}, {name: 'last'}, {name: 'email'}]);
 * </code></pre>
 *
 * <p>The proxy for a writer enabled store can be configured with a simple <code>url</code>:</p>
 * <pre><code>
// Create a standard HttpProxy instance.
var proxy = new Ext.data.HttpProxy({
    url: 'app.php/users'    // &lt;--- Supports "provides"-type urls, such as '/users.json', '/products.xml' (Hello Rails/Merb)
});
 * </code></pre>
 * <p>For finer grained control, the proxy may also be configured with an <code>API</code>:</p>
 * <pre><code>
// Maximum flexibility with the API-configuration
var proxy = new Ext.data.HttpProxy({
    api: {
        read    : 'app.php/users/read',
        create  : 'app.php/users/create',
        update  : 'app.php/users/update',
        destroy : {  // &lt;--- Supports object-syntax as well
            url: 'app.php/users/destroy',
            method: "DELETE"
        }
    }
});
 * </code></pre>
 * <p>Pulling it all together into a Writer-enabled Store:</p>
 * <pre><code>
var store = new Ext.data.Store({
    proxy: proxy,
    reader: reader,
    writer: writer,
    autoLoad: true,
    autoSave: true  // -- Cell-level updates.
});
 * </code></pre>
 * <p>Initiating write-actions <b>automatically</b>, using the existing Ext2.0 Store/Record API:</p>
 * <pre><code>
var rec = store.getAt(0);
rec.set('email', 'foo@bar.com');  // &lt;--- Immediately initiates an UPDATE action through configured proxy.

store.remove(rec);  // &lt;---- Immediately initiates a DESTROY action through configured proxy.
 * </code></pre>
 * <p>For <b>record/batch</b> updates, use the Store-configuration {@link Ext.data.Store#autoSave autoSave:false}</p>
 * <pre><code>
var store = new Ext.data.Store({
    proxy: proxy,
    reader: reader,
    writer: writer,
    autoLoad: true,
    autoSave: false  // -- disable cell-updates
});

var urec = store.getAt(0);
urec.set('email', 'foo@bar.com');

var drec = store.getAt(1);
store.remove(drec);

// Push the button!
store.save();
 * </code></pre>
 * @constructor Create a new DataWriter
 * @param {Object} meta Metadata configuration options (implementation-specific)
 * @param {Object} recordType Either an Array of field definition objects as specified
 * in {@link Ext.data.Record#create}, or an {@link Ext.data.Record} object created
 * using {@link Ext.data.Record#create}.
 */
Ext.data.DataWriter = function(config){
    Ext.apply(this, config);
};
Ext.data.DataWriter.prototype = {

    /**
     * @cfg {Boolean} writeAllFields
     * <tt>false</tt> by default.  Set <tt>true</tt> to have DataWriter return ALL fields of a modified
     * record -- not just those that changed.
     * <tt>false</tt> to have DataWriter only request modified fields from a record.
     */
    writeAllFields : false,
    /**
     * @cfg {Boolean} listful
     * <tt>false</tt> by default.  Set <tt>true</tt> to have the DataWriter <b>always</b> write HTTP params as a list,
     * even when acting upon a single record.
     */
    listful : false,    // <-- listful is actually not used internally here in DataWriter.  @see Ext.data.Store#execute.

    /**
     * Compiles a Store recordset into a data-format defined by an extension such as {@link Ext.data.JsonWriter} or {@link Ext.data.XmlWriter} in preparation for a {@link Ext.data.Api#actions server-write action}.  The first two params are similar similar in nature to {@link Ext#apply},
     * Where the first parameter is the <i>receiver</i> of paramaters and the second, baseParams, <i>the source</i>.
     * @param {Object} params The request-params receiver.
     * @param {Object} baseParams as defined by {@link Ext.data.Store#baseParams}.  The baseParms must be encoded by the extending class, eg: {@link Ext.data.JsonWriter}, {@link Ext.data.XmlWriter}.
     * @param {String} action [{@link Ext.data.Api#actions create|update|destroy}]
     * @param {Record/Record[]} rs The recordset to write, the subject(s) of the write action.
     */
    apply : function(params, baseParams, action, rs) {
        var data    = [],
        renderer    = action + 'Record';
        // TODO implement @cfg listful here
        if (Ext.isArray(rs)) {
            Ext.each(rs, function(rec){
                data.push(this[renderer](rec));
            }, this);
        }
        else if (rs instanceof Ext.data.Record) {
            data = this[renderer](rs);
        }
        this.render(params, baseParams, data);
    },

    /**
     * abstract method meant to be overridden by all DataWriter extensions.  It's the extension's job to apply the "data" to the "params".
     * The data-object provided to render is populated with data according to the meta-info defined in the user's DataReader config,
     * @param {String} action [Ext.data.Api.actions.create|read|update|destroy]
     * @param {Record[]} rs Store recordset
     * @param {Object} params Http params to be sent to server.
     * @param {Object} data object populated according to DataReader meta-data.
     */
    render : Ext.emptyFn,

    /**
     * @cfg {Function} updateRecord Abstract method that should be implemented in all subclasses
     * (e.g.: {@link Ext.data.JsonWriter#updateRecord JsonWriter.updateRecord}
     */
    updateRecord : Ext.emptyFn,

    /**
     * @cfg {Function} createRecord Abstract method that should be implemented in all subclasses
     * (e.g.: {@link Ext.data.JsonWriter#createRecord JsonWriter.createRecord})
     */
    createRecord : Ext.emptyFn,

    /**
     * @cfg {Function} destroyRecord Abstract method that should be implemented in all subclasses
     * (e.g.: {@link Ext.data.JsonWriter#destroyRecord JsonWriter.destroyRecord})
     */
    destroyRecord : Ext.emptyFn,

    /**
     * Converts a Record to a hash, taking into account the state of the Ext.data.Record along with configuration properties
     * related to its rendering, such as {@link #writeAllFields}, {@link Ext.data.Record#phantom phantom}, {@link Ext.data.Record#getChanges getChanges} and
     * {@link Ext.data.DataReader#idProperty idProperty}
     * @param {Ext.data.Record} rec The Record from which to create a hash.
     * @param {Object} config <b>NOT YET IMPLEMENTED</b>.  Will implement an exlude/only configuration for fine-control over which fields do/don't get rendered.
     * @return {Object}
     * @protected
     * TODO Implement excludes/only configuration with 2nd param?
     */
    toHash : function(rec, config) {
        var map = rec.fields.map,
            data = {},
            raw = (this.writeAllFields === false && rec.phantom === false) ? rec.getChanges() : rec.data,
            m;
        Ext.iterate(raw, function(prop, value){
            if((m = map[prop])){
                data[m.mapping ? m.mapping : m.name] = value;
            }
        });
        // we don't want to write Ext auto-generated id to hash.  Careful not to remove it on Models not having auto-increment pk though.
        // We can tell its not auto-increment if the user defined a DataReader field for it *and* that field's value is non-empty.
        // we could also do a RegExp here for the Ext.data.Record AUTO_ID prefix.
        if (rec.phantom) {
            if (rec.fields.containsKey(this.meta.idProperty) && Ext.isEmpty(rec.data[this.meta.idProperty])) {
                delete data[this.meta.idProperty];
            }
        } else {
            data[this.meta.idProperty] = rec.id;
        }
        return data;
    },

    /**
     * Converts a {@link Ext.data.DataWriter#toHash Hashed} {@link Ext.data.Record} to fields-array array suitable
     * for encoding to xml via XTemplate, eg:
<code><pre>&lt;tpl for=".">&lt;{name}>{value}&lt;/{name}&lt;/tpl></pre></code>
     * eg, <b>non-phantom</b>:
<code><pre>{id: 1, first: 'foo', last: 'bar'} --> [{name: 'id', value: 1}, {name: 'first', value: 'foo'}, {name: 'last', value: 'bar'}]</pre></code>
     * {@link Ext.data.Record#phantom Phantom} records will have had their idProperty omitted in {@link #toHash} if determined to be auto-generated.
     * Non AUTOINCREMENT pks should have been protected.
     * @param {Hash} data Hashed by Ext.data.DataWriter#toHash
     * @return {[Object]} Array of attribute-objects.
     * @protected
     */
    toArray : function(data) {
        var fields = [];
        Ext.iterate(data, function(k, v) {fields.push({name: k, value: v});},this);
        return fields;
    }
};