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
                  Object.assign(component, { x, y, z });
                  this.applyComponentChanges(origin.entity, component);
                }
              })
              .catch(server.log);
          } else throw "Failed to teleport";
        }
      } as CommandOverload<MySystem, []>
    ]
  });
};
