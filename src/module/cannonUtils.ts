import * as THREE from 'three'
import * as CANNON from 'cannon-es'

class CannonUtils {
    public static CreateConvexPolyhedron(land: THREE.Mesh, size_ = { x: 1, y: 1, z: 1 }): CANNON.ConvexPolyhedron {
        land.geometry.computeBoundingBox();
        land.geometry.computeBoundingSphere();
        land.geometry.computeTangents();
        land.geometry.computeVertexNormals();

        const position = land.geometry.attributes.position;
        const normals: any = land.geometry.index;
        var vertices = [], faces = [];

        for (var i = 0; i < position.array.length; i += 3)
            vertices.push(new CANNON.Vec3(
                (position.array[i] * (size_.x * 4 - .01)),
                (position.array[i + 1] * (size_.y * 4 - .01)),
                (position.array[i + 2]) * (size_.z * 4 - .01))
            );

        for (var i = 0; i < normals.array.length; i += 3)
            faces.push(
                [
                    normals.array[i],
                    normals.array[i + 1],
                    normals.array[i + 2]
                ]
            );

        return new CANNON.ConvexPolyhedron({ vertices, faces });
    }
}

export default CannonUtils;