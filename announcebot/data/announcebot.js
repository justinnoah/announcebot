/*
Script: announcebot.js
    The client-side javascript code for the AnnounceBot plugin.

Copyright:
    (C) Justin Noah 2014 <justinnoah@gmail.com>
    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 3, or (at your option)
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, write to:
        The Free Software Foundation, Inc.,
        51 Franklin Street, Fifth Floor
        Boston, MA  02110-1301, USA.

    In addition, as a special exception, the copyright holders give
    permission to link the code of portions of this program with the OpenSSL
    library.
    You must obey the GNU General Public License in all respects for all of
    the code used other than OpenSSL. If you modify file(s) with this
    exception, you may extend this exception to your version of the file(s),
    but you are not obligated to do so. If you do not wish to do so, delete
    this exception statement from your version. If you delete this exception
    statement from all source files in the program, then also delete it here.
*/

Ext.ns('Deluge.ux.preferences');

Deluge.ux.preferences.AnnounceBotPage = Ext.extend(Ext.Panel, {

    border: false,
    title:  _('AnnounceBot'),
    layout: 'fit',

    initComponent: function() {
        Deluge.ux.preferences.AnnounceBotPage.superclass.initComponent.call(this);

        // AnnounceBot preferences form
        this.form = this.add({
            xtype: 'form',
            layout: 'form',
            border: true,
            autoHeight: true
        });

        // Server Settings section of the preferences
        this.serverSettings = this.form.add({
            xtype: 'fieldset',
            border: false,
            title: "Server Settings",
            labelStyle: "font-weight: bolder;",
            autoHeight: true,
        });

        this.serverListHBox = this.serverSettings.add({
            xtype: 'container',
            style: "padding-right: 5px; margin-right: 5px;",
            layout: 'hbox',
            layoutConfig: {
                pack: 'start'
            }
        });
        
        this.cmbServer = this.serverListHBox.add({
            xtype: 'combo',
            mode: 'local',
            editable: false,
            hideLabel: true,
            width: 180,
            store: new Ext.data.ArrayStore({
                fields: ['serverName'],
                data: [["Test"]]
            }),
            valueField: 'serverName',
            displayField: 'serverName'
        });

        this.addServerBtn = this.serverListHBox.add({
            xtype: 'button',
            icon: 'icons/add.png',
            scale: 'small',
            text: 'Add'
        });

        this.removeServerBtn = this.serverListHBox.add({
            xtype: 'button',
            icon: 'icons/remove.png',
            scale: 'small',
            text: 'Remove'
        });

        // The actual server settings
        this.serverAutoConnectChk = this.serverSettings.add({
            xtype: 'checkbox',
            fieldLabel: 'Auto Connect'
        });

        this.serverAddressTxt = this.serverSettings.add({
            xtype: 'textfield',
            fieldLabel: 'Address',
        });

        this.serverAutoCmdCmd = this.serverSettings.add({
            xtype: 'textfield',
            fieldLabel: 'Auto Connect Cmd'
        });

        this.connectHBox = this.serverSettings.add({
            xtype: 'container',
            layout: 'hbox',
            layoutConfig: {
                pack: 'end'
            }
        });

        this.serverConnectBtn = this.connectHBox.add({
            xtype: 'button',
            icon: 'icons/deluge.png',
            scale: 'small',
            text: 'Connect'
        });

        // Channel Settings section of the preferences
        this.channelSettings = this.form.add({
            xtype: 'fieldset',
            border: false,
            title: "Channel Settings",
            labelStyle: "font-weight: bolder;",
            autoHeight: true,
        });

        this.channelListHBox = this.channelSettings.add({
            xtype: 'container',
            layout: 'hbox',
            layoutConfig: {
                pack: 'start'
            }
        });

        this.cmbChannel = this.channelListHBox.add({
            xtype: 'combo',
            mode: 'local',
            editable: false,
            hideLabel: true,
            width: 180,
            store: new Ext.data.ArrayStore({
                fields: ['channelName'],
                data: [["Test"]]
            }),
            valueField: 'channelName',
            displayField: 'channelName'
        });

        this.addChannelBtn = this.channelListHBox.add({
            xtype: 'button',
            icon: 'icons/add.png',
            scale: 'small',
            text: 'Add'
        });

        this.removeChannelBtn = this.channelListHBox.add({
            xtype: 'button',
            icon: 'icons/remove.png',
            scale: 'small',
            text: 'Remove'
        });

        this.autoJoinChk = this.channelSettings.add({
            xtype: 'checkbox',
            fieldLabel: 'Auto Join'
        });

        this.channelRegexTxt = this.channelSettings.add({
            xtype: 'textfield',
            fieldLabel: 'Regex',
        });

        deluge.preferences.on('show', this.updateConfig, this);
    },

    onRender: function(ct, position) {
        Deluge.ux.preferences.AnnounceBotPage.superclass.onRender.call(this, ct, position);
        this.form.layout = new Ext.layout.FormLayout();
        this.form.layout.setContainer(this);
        this.form.doLayout();
    },

    onApply: function() {
        return;
    },

    onOk: function() {
        this.onApply();
    },

    afterRender: function() {
        Deluge.ux.preferences.AnnounceBotPage.superclass.afterRender.call(this);
    },

    updateConfig: function() {
    }
});

Deluge.plugins.AnnounceBotPlugin = Ext.extend(Deluge.Plugin, {

    name: "AnnounceBot",

	onDisable: function() {
        deluge.preferences.removePage(this.prefsPage);
	},

	onEnable: function() {
        this.prefsPage = deluge.preferences.addPage(new Deluge.ux.preferences.AnnounceBotPage());
	}
});
Deluge.registerPlugin('AnnounceBot', Deluge.plugins.AnnounceBotPlugin);
