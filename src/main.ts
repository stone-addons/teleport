import { system, MySystem } from "./system";
import { isPlayerInfo } from "./utils";

system.initialize = function() {
  server.log("Teleport Addon Loaded");
  this.registerCommand("home", {
    description: "commands.custom.home",
    permission: 0,
    overloads: [
      {
        parameters: [],
        handler(origin) {
          if (!origin.entity) throw "Player required";
          const info = this.actorInfo(origin.entity);
          if (isPlayerInfo(info)) {
            const [x, y, z] = info.spawnPoint;
            if (info.dim !== 0) throw "Cannot cross-dimension teleport";
            if (x === 0 && y === -1 && z === 0) throw "No home found!";
            this.openModalForm(
              origin.entity,
              JSON.stringify({
                type: "modal",
                title: "Teleport Menu",
                content: `Do you want to teleport to home(${x}, ${y}, ${z})`,
                button1: "Yes",
                button2: "No"
              })
            )
              .then(sel => {
                if (JSON.parse(sel) === true) {
                  const component = this.createComponent(
                    origin.entity,
                    MinecraftComponent.Position
                  );
                  Object.assign(component.data, { x, y, z });
                  this.applyComponentChanges(origin.entity, component);
                }
              })
              .catch(server.log);
          } else throw "Failed to teleport";
        }
      } as CommandOverload<MySystem, []>
    ]
  });
  this.registerCommand("spawn", {
    description: "commands.custom.spawn",
    permission: 0,
    overloads: [
      {
        parameters: [],
        handler(origin) {
          if (!origin.entity) throw "Player required";
          const info = this.actorInfo(origin.entity);
          const world = this.worldInfo();
          if (isPlayerInfo(info)) {
            const [x, y, z] = world.spawnPoint;
            if (info.dim !== 0) throw "Cannot cross-dimension teleport";
            if (y === 32767)
              throw "Cannot detect spawnpoint altitude, you need to use /setworldpoint at first";
            this.openModalForm(
              origin.entity,
              JSON.stringify({
                type: "modal",
                title: "Teleport Menu",
                content: `Do you want to teleport to spawn(${x}, ${y}, ${z})`,
                button1: "Yes",
                button2: "No"
              })
            )
              .then(sel => {
                if (JSON.parse(sel) === true) {
                  const component = this.createComponent(
                    origin.entity,
                    MinecraftComponent.Position
                  );
                  Object.assign(component.data, { x, y, z });
                  this.applyComponentChanges(origin.entity, component);
                }
              })
              .catch(server.log);
          } else throw "Failed to teleport";
        }
      } as CommandOverload<MySystem, []>
    ]
  });
  this.registerCommand("tpa", {
    description: "commands.custom.tpa",
    permission: 0,
    overloads: [
      {
        parameters: [
          {
            type: "player-selector",
            name: "target"
          },
          {
            type: "message",
            name: "message",
            optional: true
          }
        ],
        handler(origin, [players, msg]) {
          if (
            !origin.entity ||
            origin.entity.__identifier__ !== "minecraft:player"
          )
            throw "Player required";
          if (players.length !== 1)
            throw `Cannot teleport to ${players.length} target(s)`;
          const info = this.actorInfo(origin.entity) as PlayerInfo;
          if (!info) throw `Cannot found actor info`;
          const target = players[0];
          this.openModalForm(
            target,
            JSON.stringify({
              type: "modal",
              title: "Teleport Request",
              content: `${info.name} want teleport to you: ${msg}`,
              button1: "Yes",
              button2: "No"
            })
          )
            .then(sel => {
              if (JSON.parse(sel) === true) {
                const oth = this.getComponent(
                  target,
                  MinecraftComponent.Position
                );
                const component = this.createComponent(
                  origin.entity,
                  MinecraftComponent.Position
                );
                Object.assign(component.data, oth.data);
                this.applyComponentChanges(origin.entity, component);
              }
            })
            .catch(server.log);
        }
      } as CommandOverload<MySystem, ["player-selector", "message"]>
    ]
  });
};
