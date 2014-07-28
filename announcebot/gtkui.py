#
# gtkui.py
#
# Copyright (C) 2014 Justin Noah <justinnoah@gmail.com>
#
# Basic plugin template created by:
# Copyright (C) 2008 Martijn Voncken <mvoncken@gmail.com>
# Copyright (C) 2007-2009 Andrew Resch <andrewresch@gmail.com>
# Copyright (C) 2009 Damien Churchill <damoxc@gmail.com>
#
# Deluge is free software.
#
# You may redistribute it and/or modify it under the terms of the
# GNU General Public License, as published by the Free Software
# Foundation; either version 3 of the License, or (at your option)
# any later version.
#
# deluge is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with deluge.    If not, write to:
# 	The Free Software Foundation, Inc.,
# 	51 Franklin Street, Fifth Floor
# 	Boston, MA  02110-1301, USA.
#
#    In addition, as a special exception, the copyright holders give
#    permission to link the code of portions of this program with the OpenSSL
#    library.
#    You must obey the GNU General Public License in all respects for all of
#    the code used other than OpenSSL. If you modify file(s) with this
#    exception, you may extend this exception to your version of the file(s),
#    but you are not obligated to do so. If you do not wish to do so, delete
#    this exception statement from your version. If you delete this exception
#    statement from all source files in the program, then also delete it here.
#

import gtk

from deluge.log import LOG as log
from deluge.ui.client import client
from deluge.plugins.pluginbase import GtkPluginBase
import deluge.component as component
import deluge.common

from common import get_resource

class GtkUI(GtkPluginBase):
    def enable(self):
        self.glade = gtk.glade.XML(get_resource("config.glade"))

        # Get widgets, setup signals, etc
        self.setup_prefs_page()

        component.get("Preferences").add_page("AnnounceBot", self.glade.get_widget("prefs_box"))
        component.get("PluginManager").register_hook("on_apply_prefs", self.on_apply_prefs)
        component.get("PluginManager").register_hook("on_show_prefs", self.on_show_prefs)

    def disable(self):
        component.get("Preferences").remove_page("AnnounceBot")
        component.get("PluginManager").deregister_hook("on_apply_prefs", self.on_apply_prefs)
        component.get("PluginManager").deregister_hook("on_show_prefs", self.on_show_prefs)

    def on_apply_prefs(self):
        log.debug("applying prefs for AnnounceBot")
        client.announcebot.set_config(self.config)

    def on_show_prefs(self):
        client.announcebot.get_config().addCallback(self.cb_get_config)

    def cb_get_config(self, config):
        "callback for on show_prefs"

        # Keep track of the config locally, but update when we receive a new
        self.config = config

        # Avoid duplicates in the list
        self.serverListStore.clear()

        # Server names
        servers = sorted(config.keys())

        # Add the servers from the config
        for key in servers:
            cell = gtk.CellRendererText()
            self.serverListStore.append([key])
            self.serverList.pack_end(cell, True)

        # On server list update, select the 1st server if there are any
        # in the config
        if servers:
            self.serverList.set_active(0)

    def setup_prefs_page(self):
        # Grab the objects from the glade file
        self.serverList = self.glade.get_widget('cmbServers')
        self.btnAddServer = self.glade.get_widget('btnAddServer')
        self.btnRemoveServer = self.glade.get_widget('btnRemoveServer')
        self.btnConnect = self.glade.get_widget('btnConnect')
        self.chkAutoConnect = self.glade.get_widget('chkAutoConnect')
        self.txtAddress = self.glade.get_widget('txtAddress')
        self.txtAutoConCmd = self.glade.get_widget('txtAutoConCmd')
        self.txtBotName = self.glade.get_widget('txtBotName')

        # Setup the ListStore for the Server List ComboBox
        self.serverListStore = gtk.ListStore(str)
        self.serverList.set_model(self.serverListStore)
