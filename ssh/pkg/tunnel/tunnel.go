package tunnel

import (
	"context"
	"net"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/shellhub-io/shellhub/pkg/api/internalclient"
	"github.com/shellhub-io/shellhub/pkg/httptunnel"
	log "github.com/sirupsen/logrus"
)

type Tunnel struct {
	Tunnel *httptunnel.Tunnel
}

func NewTunnel(connection, dial string) *Tunnel {
	tunnel := &Tunnel{Tunnel: httptunnel.NewTunnel(connection, dial)}
	tunnel.Tunnel.ConnectionHandler = func(request *http.Request) (string, error) {
		return request.Header.Get(internalclient.DeviceUIDHeader), nil
	}
	tunnel.Tunnel.CloseHandler = func(id string) {
		if err := internalclient.NewClient().DevicesOffline(id); err != nil {
			log.Error(err)
		}
	}
	tunnel.Tunnel.KeepAliveHandler = func(id string) {
		if err := internalclient.NewClient().DevicesHeartbeat(id); err != nil {
			log.Error(err)
		}
	}

	return tunnel
}

func (t *Tunnel) GetRouter() *mux.Router {
	router, ok := t.Tunnel.Router().(*mux.Router)
	if !ok {
		// TODO: should the Connect does not up when this assertion fail?
		log.Error("type assertion failed")
	}

	return router
}

func (t *Tunnel) Dial(ctx context.Context, id string) (net.Conn, error) {
	return t.Tunnel.Dial(ctx, id)
}
